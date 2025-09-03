import * as THREE from 'three';

import Project from './projects/projects.js';
import {InteractiveGallery, ParticleSystem, CompilerProject, DissProject} from './projects/ExampleProjects.js';

// Global variables
let scene, camera, renderer;
let currentSection = 0;
let currentProject = null;
let sections = []; // Initialize as empty array
let isScrolling = false;

// Project management
const projects = new Map();
let projectManager = null;

// Initialize Three.js
function init() {
    console.log('Starting initialization...');
    
    // Get DOM elements
    const canvasContainer = document.getElementById('canvas-container');
    const loadingScreen = document.getElementById('loading-screen');
    
    if (!canvasContainer) {
        console.error('Canvas container not found! The DOM might not be ready yet.');
        return;
    }
    
    console.log('Canvas container found, initializing Three.js...');
    
    sections = document.querySelectorAll('section');
    
    // Initialize Three.js components
    scene = new THREE.Scene();
    
    // Camera
    const width = canvasContainer.clientWidth;
    const height = canvasContainer.clientHeight;

        // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));


    camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    renderer.setSize(width, height, false);    camera.position.z = 5;
    

    canvasContainer.appendChild(renderer.domElement);
    
    console.log('Three.js initialized successfully');
    
    //showSection(0);

    // Initialize projects
    initializeProjects();
    
    // Setup event listeners
    setupEventListeners();
    
    // Animation loop
    animate();
    
    // Hide loading screen
    setTimeout(() => {
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
                showSection(0);
            }, 500);
        } else {
            showSection(0);
        }
    }, 1000);
}

// Initialize all projects
async function initializeProjects() {
    try {
        console.log('Initializing projects...');
        
        // Verify Three.js components are ready
        if (!scene || !camera || !renderer) {
            console.error('Three.js components not initialized!');
            return;
        }
        

        
        // Create project instances
        const particleSystem = new ParticleSystem(scene, camera, renderer);
        
        // Store projects by name for easy access
        projects.set('particle-system', particleSystem);

        const compilerProject = new CompilerProject(scene, camera ,renderer)
        projects.set('compiler-project',compilerProject)
        
        const dissProject = new DissProject(scene, camera, renderer)
        projects.set('diss-project', dissProject)

        const interactiveGallery = new InteractiveGallery(scene, camera, renderer, projects);

        projects.set('interactive-gallery', interactiveGallery);

        interactiveGallery.onProjectSelect = (projectName, project) => {
            currentProject = project;
            console.log("Switching to project:", projectName);
            addBackToNavigatorButton()
        }

        projects.set('project-navigator', interactiveGallery);


        await new Promise(resolve => setTimeout(resolve, 100)); // Slight delay to ensure proper setup
        // Wait for all projects to be ready
        const projectPromises = Array.from(projects.values()).map(project => {
            return new Promise(resolve => {
                if (project.isLoaded) {
                    resolve();
                } else {
                    // Wait for project to be ready
                    const checkReady = () => {
                        if (project.isLoaded) {
                            resolve();
                        } else {
                            setTimeout(checkReady, 100);
                        }
                    };
                    checkReady();
                }
            });
        });
        
        await Promise.all(projectPromises);
        console.log('All projects initialized successfully');
        
        // Hide all projects initially
        projects.forEach(project => project.hide());
        
    } catch (error) {
        console.error('Failed to initialize projects:', error);
    }
}

function addBackToNavigatorButton(){
    const existingBtn = document.querySelector('.project-back-btn');
    if (existingBtn) existingBtn.remove();

    const backBtn = document.createElement('button');
    backBtn.className = 'project-back-btn';
    backBtn.innerHTML = '<- Back to Project Gallery';
    backBtn.style.cssText = `
        position: fixed;
        top: 100px;
        left: 30px;
        z-index: 200;
        background: rgba(0, 0, 0, 0.8);
        border: 1px solid rgba(255, 255, 255, 0.3);
        color: white;
        padding: 10px 20px;
        cursor: pointer;
        border-radius: 5px;
        font-size: 14px;
        transition: all 0.3s ease;
    `;
    backBtn.addEventListener('mouseenter', () => {
        backBtn.style.background = 'rgba(0, 255, 136, 0.2)';
        backBtn.style.borderColor = 'rgba(0, 255, 136, 0.5)';
    });
    
    backBtn.addEventListener('mouseleave', () => {
        backBtn.style.background = 'rgba(0, 0, 0, 0.8)';
        backBtn.style.borderColor = 'rgba(255, 255, 255, 0.3)';
    });
    
    backBtn.addEventListener('mousedown', (e) => {
        e.preventDefault();
        e.stopPropagation();

        if(backBtn.dataset.processing==='true') return;

        backBtn.dataset.processing = 'true';

        // Hide current project
        if (currentProject) {
            currentProject.hide();
        }

        setTimeout(()=>
        {
            const navigator = projects.get('project-navigator');
            if (navigator) {
                currentProject = navigator;
                navigator.show();
                console.log('Switched to project navigator');
            }
            else{
                console.error('Project Navigator cannot be displayed')
            }
        

        // Show the navigator again
        
        // Remove the back button
        backBtn.remove();
        
        // Reset camera for navigator view
        camera.position.set(0, 0, 10);
        }, 100);
    });
    
    document.body.appendChild(backBtn);
}




// Setup all event listeners
function setupEventListeners() {
    // Smooth scroll handling
    let scrollTimeout;
    window.addEventListener('wheel', (e) => {
        if (isScrolling) return;
        
        clearTimeout(scrollTimeout);
        isScrolling = true;
        
        if (e.deltaY > 0 && currentSection < sections.length - 1) {
            currentSection++;
        } else if (e.deltaY < 0 && currentSection > 0) {
            currentSection--;
        }
        
        showSection(currentSection);
        
        scrollTimeout = setTimeout(() => {
            isScrolling = false;
        }, 1000);
    });
    
    // Navigation click handlers
    document.querySelectorAll('.nav a').forEach((link, index) => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            currentSection = index;
            showSection(currentSection);
        });
    });

    setupProjectCards();

    // Handle window resize
    window.addEventListener('resize', () => {
        if (!camera || !renderer) return;
        
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
    
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });
    
    // Cleanup when page unloads
    window.addEventListener('beforeunload', () => {
        if (currentProject) {
            currentProject.hide();
        }
        
        // Cleanup all projects
        projects.forEach(project => {
            if (project && typeof project.destroy === 'function') {
                project.destroy();
            }
        });
        
        projects.clear();
    });
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    // Safety check
    if (!renderer || !scene || !camera) return;
    
    const deltaTime = 0.016; // Approximate 60fps
    const elapsedTime = Date.now() * 0.001; // Convert to seconds
    
    // Animate current project if active
    if (currentProject && currentProject.isActive) {
        currentProject.animate(deltaTime, elapsedTime);
    }
    
    renderer.render(scene, camera);
}

function setupProjectCards() {
    const projectCards = document.querySelectorAll('.project-card[data-project]');
    
    projectCards.forEach(card => {
        card.addEventListener('click', (e) => {
            e.stopPropagation();
            const projectName = card.dataset.project;
            
            console.log('Project card clicked:', projectName);
            
            // Hide all project cards temporarily
            document.querySelectorAll('.project-card').forEach(c => {
                c.style.opacity = '0.3';
                c.style.pointerEvents = 'none';
            });
            
            // Show the selected project
            showProject(projectName);
            
            // Add a back button or instruction
            addBackToNavigatorButton();
        });
    });
}

// Section management
function showSection(index) {
    if (!sections || sections.length === 0) return;
    
    sections.forEach((section, i) => {
        if (i === index) {
            section.classList.add('visible');
            section.style.display = 'flex';
        } else {
            section.classList.remove('visible');
        }
    });
    
    // Update 3D scene based on section
    updateSceneForSection(index);
}

// Update 3D scene based on current section
function updateSceneForSection(index) {
    // Hide current project
    if (currentProject) {
        currentProject.hide();
        currentProject = null;
    }

    const backBtn = document.querySelector('.project-back-btn');
    if (backBtn) backBtn.remove();
    
    // Safety check for camera
    if (!camera) return;
    
    switch(index) {
        case 0: // Home
            projects.forEach(project => {if(project && project.hide){
                project.hide();
                }
            });
            camera.position.set(0, 0, 5);
            // No project active on home
            break;
            
        case 1: // About
            camera.position.set(0, 0, 3);
            // Maybe show a simple rotating logo or something
            break;
            
        case 2: // Projects
            camera.position.set(0, 0, 7);
            // Show the interactive gallery
            showProject('project-navigator');
            break;
            
        case 3: // Contact
            camera.position.set(0, 0, 4);
            // Show particle system for contact section
            showProject('particle-system');
            break;
    }
}

// Show a specific project
function showProject(projectName) {
    const project = projects.get(projectName);
    if (project && project.isLoaded) {
        currentProject = project;
        project.show();
        console.log(`Showing project: ${projectName}`);
    } else {
        console.warn(`Project not found or not ready: ${projectName}`);
    }
}

// Switch between projects (useful for project navigation)
function switchProject(fromProject, toProject) {
    const from = projects.get(fromProject);
    const to = projects.get(toProject);
    
    if (from) from.hide();
    if (to && to.isLoaded) {
        currentProject = to;
        to.show();
    }
}

// Get all project information
function getProjectsInfo() {
    const info = {};
    projects.forEach((project, name) => {
        info[name] = project.getInfo();
    });
    return info;
}

// Debug function - remove in production
function debugProjects() {
    console.log('Three.js Status:', {
        scene: !!scene,
        camera: !!camera,
        renderer: !!renderer
    });
    console.log('Projects Info:', getProjectsInfo());
    console.log('Current Project:', currentProject ? currentProject.config.name : 'None');
    console.log('Current Section:', currentSection);
}

// Make debug function available globally (remove in production)
window.debugProjects = debugProjects;

// Wait for DOM to be fully loaded before initializing
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    // DOM is already loaded, but wait for next tick to ensure everything is ready
    setTimeout(init, 0);
}