/**
 * Base Project Class
 * Extend this class for each of your portfolio projects
 */
import * as THREE from 'three';

class Project {
    constructor(scene, camera, renderer, config = {}) {
        // Core Three.js references
        this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;
        
        // Project configuration
        this.config = {
            name: 'Untitled Project',
            autoRotate: false,
            responsive: true,
            animationSpeed: 1,
            ...config
        };
        
        // Project state
        this.isActive = false;
        this.isLoaded = false;
        this.isDestroyed = false;
        
        // Object management
        this.objects = [];
        this.lights = [];
        this.materials = [];
        this.geometries = [];
        this.textures = [];
        
        // Animation properties
        this.clock = new THREE.Clock();
        this.animationMixers = [];
        this.tweens = [];
        
        // Mouse/interaction
        this.mouse = new THREE.Vector2();
        this.raycaster = new THREE.Raycaster();
        this.interactiveObjects = [];
        
        // Event bindings
        this.boundMethods = {
            onMouseMove: this.onMouseMove.bind(this),
            onMouseClick: this.onMouseClick.bind(this),
            onWindowResize: this.onWindowResize.bind(this)
        };
        
        // Initialize the project
        this.init();
    }
    
    /**
     * Initialize the project - called automatically
     * Override this method in child classes
     */
    async init() {
        console.log(`Initializing project: ${this.config.name}`);
        
        try {
            await this.preload();
            this.create();
            this.setupLights();
            this.setupInteractions();
            this.isLoaded = true;
            this.onReady();
        } catch (error) {
            console.error(`Failed to initialize project ${this.config.name}:`, error);
        }
    }
    
    /**
     * Preload assets (textures, models, etc.)
     * Override this method to load project-specific assets
     */
    async preload() {
        // Override in child classes to load assets
        // Example:
        // const texture = await this.loadTexture('/path/to/texture.jpg');
        // this.textures.push(texture);
    }
    
    /**
     * Create the 3D content
     * Override this method in child classes
     */
    create() {
        // Override in child classes to create 3D objects
        console.warn(`Project ${this.config.name} should override the create() method`);
    }
    
    /**
     * Setup default lighting
     * Override to customize lighting
     */
    setupLights() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        this.addLight(ambientLight);
        
        // Directional light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 5, 5);
        this.addLight(directionalLight);
    }
    
    /**
     * Setup interaction handlers
     */
    setupInteractions() {
        if (this.config.responsive) {
            window.addEventListener('resize', this.boundMethods.onWindowResize);
        }
    }
    
    /**
     * Called when project is fully loaded and ready
     * Override for custom initialization
     */
    onReady() {
        console.log(`Project ${this.config.name} is ready`);
    }
    
    /**
     * Main animation loop - called every frame when active
     * Override this method in child classes
     */
    animate(deltaTime, elapsedTime) {
        // Auto-rotation if enabled
        if (this.config.autoRotate && this.objects.length > 0) {
            this.objects.forEach(obj => {
                obj.rotation.y += deltaTime * this.config.animationSpeed;
            });
        }
        
        // Update animation mixers
        this.animationMixers.forEach(mixer => {
            mixer.update(deltaTime);
        });
        
        // Override in child classes for custom animations
    }
    
    /**
     * Show/activate the project
     */
    show() {
        if (this.isDestroyed) return;
        
        this.objects.forEach(obj => {
            obj.visible = true;
        });
        
        this.lights.forEach(light => {
            light.visible = true;
        });
        
        // Add event listeners
        window.addEventListener('mousemove', this.boundMethods.onMouseMove);
        window.addEventListener('click', this.boundMethods.onMouseClick);
        
        this.isActive = true;
        this.onShow();
    }
    
    /**
     * Hide/deactivate the project
     */
    hide() {
        if (this.isDestroyed) return;
        
        this.objects.forEach(obj => {
            obj.visible = false;
        });
        
        this.lights.forEach(light => {
            light.visible = false;
        });
        
        // Remove event listeners
        window.removeEventListener('mousemove', this.boundMethods.onMouseMove);
        window.removeEventListener('click', this.boundMethods.onMouseClick);
        
        this.isActive = false;
        this.onHide();
    }
    
    /**
     * Called when project is shown
     * Override for custom show behavior
     */
    onShow() {
        // Override in child classes
    }
    
    /**
     * Called when project is hidden
     * Override for custom hide behavior
     */
    onHide() {
        // Override in child classes
    }
    
    /**
     * Handle mouse movement
     */
    onMouseMove(event) {
        if (!this.isActive) return;
        
        // Normalize mouse coordinates
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        
        // Update raycaster
        this.raycaster.setFromCamera(this.mouse, this.camera);
        
        // Check intersections with interactive objects
        if (this.interactiveObjects.length > 0) {
            const intersects = this.raycaster.intersectObjects(this.interactiveObjects);
            this.onMouseIntersect(intersects);
        }
        
        // Custom mouse move behavior
        this.onMouseMoveCustom(event);
    }
    
    /**
     * Handle mouse clicks
     */
    onMouseClick(event) {
        if (!this.isActive) return;
        
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.interactiveObjects);
        
        if (intersects.length > 0) {
            this.onObjectClick(intersects[0]);
        }
        
        this.onMouseClickCustom(event);
    }
    
    /**
     * Handle window resize
     */
    onWindowResize() {
        if (!this.isActive || !this.config.responsive) return;
        
        if (!this.camera || !this.renderer){
            console.warn(`${this.config.name} missing camera or renderer for resize handling`);
        }

        // Update camera aspect ratio
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        
        // Update renderer size
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        
        // Custom resize behavior
        this.onResizeCustom();
    }
    
    /**
     * Custom mouse move handler - override in child classes
     */
    onMouseMoveCustom(event) {
        // Override in child classes
    }
    
    /**
     * Custom mouse click handler - override in child classes
     */
    onMouseClickCustom(event) {
        // Override in child classes
    }
    
    /**
     * Custom resize handler - override in child classes
     */
    onResizeCustom() {
        // Override in child classes
    }
    
    /**
     * Handle mouse intersections with objects
     */
    onMouseIntersect(intersects) {
        // Override in child classes
    }
    
    /**
     * Handle object clicks
     */
    onObjectClick(intersection) {
        console.log('Object clicked:', intersection.object);
        // Override in child classes
    }
    
    /**
     * Helper method to add objects to the scene
     */
    addObject(object) {
        if(!this.scene){
            console.error('Scene not available')
            return object;
        }
        this.objects.push(object);
        this.scene.add(object);
        return object;
    }
    
    /**
     * Helper method to add lights to the scene
     */
    addLight(light) {
        if(!this.scene){
            console.error('Scene not available')
            return light;
        }
        this.lights.push(light);
        this.scene.add(light);
        return light;
    }
    
    /**
     * Helper method to make objects interactive
     */
    makeInteractive(object) {
        if (!this.interactiveObjects.includes(object)) {
            this.interactiveObjects.push(object);
        }
        return object;
    }
    
    /**
     * Helper method to load textures
     */
    loadTexture(url) {
        return new Promise((resolve, reject) => {
            const loader = new THREE.TextureLoader();
            loader.load(
                url,
                (texture) => {
                    this.textures.push(texture);
                    resolve(texture);
                },
                undefined,
                reject
            );
        });
    }
    
    /**
     * Helper method to create materials
     */
    createMaterial(type, properties = {}) {
        let material;
        
        switch (type) {
            case 'basic':
                material = new THREE.MeshBasicMaterial(properties);
                break;
            case 'standard':
                material = new THREE.MeshStandardMaterial(properties);
                break;
            case 'phong':
                material = new THREE.MeshPhongMaterial(properties);
                break;
            default:
                material = new THREE.MeshBasicMaterial(properties);
        }
        
        this.materials.push(material);
        return material;
    }
    
    /**
     * Helper method to create geometries
     */
    createGeometry(type, ...args) {
        let geometry;
        
        switch (type) {
            case 'box':
                geometry = new THREE.BoxGeometry(...args);
                break;
            case 'sphere':
                geometry = new THREE.SphereGeometry(...args);
                break;
            case 'plane':
                geometry = new THREE.PlaneGeometry(...args);
                break;
            case 'cylinder':
                geometry = new THREE.CylinderGeometry(...args);
                break;
            default:
                geometry = new THREE.BoxGeometry(...args);
        }
        
        this.geometries.push(geometry);
        return geometry;
    }
    
    /**
     * Clean up resources and remove from scene
     */
    destroy() {
        if (this.isDestroyed) return;
        
        // Hide first
        this.hide();
        
        if(this.scene){
            // Remove all objects from scene
            this.objects.forEach(obj => {
                this.scene.remove(obj);
            });
        
            // Remove all lights from scene
            this.lights.forEach(light => {
                this.scene.remove(light);
            });
        }
        // Dispose of geometries
        this.geometries.forEach(geometry => {
            geometry.dispose();
        });
        
        // Dispose of materials
        this.materials.forEach(material => {
            material.dispose();
        });
        
        // Dispose of textures
        this.textures.forEach(texture => {
            texture.dispose();
        });
        
        // Clean up animation mixers
        this.animationMixers.forEach(mixer => {
            mixer.uncacheRoot(mixer.getRoot());
        });
        
        // Remove event listeners
        window.removeEventListener('resize', this.boundMethods.onWindowResize);
        window.removeEventListener('mousemove', this.boundMethods.onMouseMove);
        window.removeEventListener('click', this.boundMethods.onMouseClick);
        
        // Clear arrays
        this.objects = [];
        this.lights = [];
        this.materials = [];
        this.geometries = [];
        this.textures = [];
        this.animationMixers = [];
        this.interactiveObjects = [];
        
        this.isDestroyed = true;
        this.onDestroy();
    }
    
    /**
     * Called when project is destroyed
     * Override for custom cleanup
     */
    onDestroy() {
        console.log(`Project ${this.config.name} destroyed`);
    }
    
    /**
     * Get project info
     */
    getInfo() {
        return {
            name: this.config.name,
            isActive: this.isActive,
            isLoaded: this.isLoaded,
            objectCount: this.objects.length,
            lightCount: this.lights.length
        };
    }
}

export default Project;