/**
 * Example Project extending the base Project class
 * This shows how to use the superclass for your portfolio projects
 */

import * as THREE from 'three';
import Project from './projects.js';
/**
 * Interactive Gallery that serves as a project navigator
 * Each cube represents a different project that can be launched
 */

/**
 * this.demoSigns = ['Family', 'Fire', 'Hello', 'Get Together', 'Love'];
 */

class SignLanguageProject extends Project {
    constructor(scene, camera, renderer) {
        super(scene, camera, renderer, {
            name: 'Sign Language Translator',
            autoRotate: false,
            animationSpeed: 0.5,
            responsive: true
        });
        
        this.currentView = 0;
        this.panels = [];
        this.mainGroup = null;
        this.navigationButtons = null;
        this.folder = "./src/projects/AI/";

        // 0xfca5a5
        this.borderColour = 0xe2e8f0;
        this.titleColour = '#1e40af';
        
        
        this.imgNames = {confMat:"confusion_matrix_final.png", 
            tflite:"tfliteOutput.png",
            confDist:"predictionConfDistribution.png",
            hardware:"Hardwareutilise.png",
            sketch:"RoughDeviceSketch.png",
            skeleton: "SkeletonVideoScreenShot.png"
        };
        this.ImageLoader = new THREE.ImageLoader();

        // Project content data
        this.projectSections = [
            {
                title: 'Sign Language Translation using LSTM',
                subtitle: 'Overview',
                content: {
                    description: `This project was for my undergraduate dissertation which I designed an LSTM to translate ASL in real-time. It was trained on exclusively hand landmark data generated from my dataset using MediaPipe. After the model was trained, it was then quantized using TF-Lite for use on an embedded system. The goal of this was to provide a cost-effective template for how lower-income organisations can provide support for deaf people.`,
                    keyPoints: [
                        'Real-time hand sign identification',
                        'Custom parallel LSTM architecture trained using the ASL Citizen Dataset',
                        'Quantized model runs smoothly on Embedded Systems',
                        'MediaPipe preprocessing with sliding window until inference',
                        'Trained to Identify 150+ Unique ASL Signs'
                    ]
                }
            },
            {
                title: 'Dataset & Processing',
                leftContent: {
                    title: 'Dataset and Transformation',
                    text: 'For this project, I used a subset of the ASL Citizen dataset, by Microsoft Research, I then converted each entry in my subset to a frame-by-frame reading of the hand landmarks identified in each frame. This was the data fed to my model. MediaPipe was ideal for this as it supports lightweight hand landmarks tracking frame by frame which is desirable for a architecture designed to run efficiently on embedded systems.',
                    link: `https://www.microsoft.com/en-us/research/project/asl-citizen/`
                },
                rightContent: {
                    title: 'Preprocessing Pipeline',
                    text: `At runtime, each frame in the video feed is sampled at 30FPS storing detected hand landmarks in a buffer which requires a minimum size before a prediction is cast. It expands until reaching a maximum size to reduce diluting context and affecting inference where it then switches to use a sliding window method. The min and max sizes were determined by statistical analysis over the training data. A prediction is accepted when above a set threshold where the buffer is then reset.`
                }
            },
            {
                title: 'Architecture',
                leftContent: {
                    title: 'Model Training',
                    text: 'Training was done for 300 Epochs, using a batch compute system. Primary evaluation metric was validation loss, to ensure the model could produce higher confidence predictions. However, several other metrics such as Top K Categorical (K=3) Accuracy were also monitored to assess how the model was converging. Several methods of regularisation were used: Dropout, Recurrent Dropout and L2. Several other techniques were also implemented, including: Each hand normalised relative to the wrist, Label Smoothing and learning rate plateauing.'
                },
                rightContent: {
                    title: 'LSTM Network',
                    imagePath: './src/projects/AI/finalArch.png',
                    
                }
            },
            {
                title: 'Results & Future Work',
                content: {
                    results: [
                        'Achieved 95.2% accuracy on validation set',
                        'Real-time inference at 30 FPS',
                        'Robust to lighting variations',
                        'Works across different signers'
                    ],
                    futureWork: [
                        'Expand vocabulary to 200+ signs',
                        'Add sentence-level translation',
                        'Mobile app deployment',
                        'Multi-hand gesture support'
                    ]
                }
            }
        ];
    }
    
    create() {
        this.mainGroup = new THREE.Group();
        
        // Create all panels
        this.createOverviewPanel();
        this.createTwoColumnPanels();
        this.createResultsPanel();
        
        // Create navigation
        this.createNavigationButtons();
        
        this.addObject(this.mainGroup);
        
        // Show initial view
        this.showView(0);
    }
    
    createOverviewPanel() {
        const group = new THREE.Group();
        
        // Title
        const titleCanvas = this.createTextCanvas(
            this.projectSections[0].title,
            800, 80,
            { fontSize: 42, color: '#2563eb', bgColor: 'transparent' }
        );
        const titleMesh = new THREE.Mesh(
            new THREE.PlaneGeometry(8, 0.8),
            new THREE.MeshBasicMaterial({ map: titleCanvas, transparent: true })
        );
        titleMesh.position.y = 4;
        group.add(titleMesh);
        
        // Subtitle
        const subtitleCanvas = this.createTextCanvas(
            this.projectSections[0].subtitle,
            600, 50,
            { fontSize: 28, color: '#64748b', bgColor: 'transparent' }
            );

        const subtitleMesh = new THREE.Mesh(
            new THREE.PlaneGeometry(6, 0.5),
            new THREE.MeshBasicMaterial({ map: subtitleCanvas, transparent: true })
        );
        subtitleMesh.position.y = 3.2;
        group.add(subtitleMesh);
        
        // Description

        const wrappedDesc = this.wrapText(this.projectSections[0].content.description, 76);
        const descCanvas = this.createMultiLineTextCanvas(
            wrappedDesc,
            880, 200,
            { fontSize: 24, color: '#374151', bgColor: 'transparent' }
        );
        const descMesh = new THREE.Mesh(
            new THREE.PlaneGeometry(8.8, 2),
            new THREE.MeshBasicMaterial({ map: descCanvas, transparent: true })
        );
        descMesh.position.y = 2;
        descMesh.position.x = 0.0;
        group.add(descMesh);

        const featuresSubtitle = this.createTextCanvas(
            'Core Features',
            400,40,
            {fontSize: 28, color: '#64748b', bgColor: 'transparent'}
        )
        const featuresSubtitleMesh = new THREE.Mesh(
            new THREE.PlaneGeometry(4,0.4),
            new THREE.MeshBasicMaterial({ map: featuresSubtitle, transparent: true 
            })
        );
        featuresSubtitleMesh.position.y = 0.6;
        group.add(featuresSubtitleMesh);
    
        
        // Key points
        this.projectSections[0].content.keyPoints.forEach((point, i) => {
            const pointCanvas = this.createTextCanvas(
                `• ${point}`,
                600, 40,
                { fontSize: 16, color: '#1f2937', bgColor: 'transparent', align: 'left' }
            );
            const pointMesh = new THREE.Mesh(
                new THREE.PlaneGeometry(6, 0.4),
                new THREE.MeshBasicMaterial({ map: pointCanvas, transparent: true })
            );
            pointMesh.position.set(0, 0.1 - i * 0.5, 0.01);
            group.add(pointMesh);
        });
        
        group.visible = true;
        this.panels.push(group);
        this.mainGroup.add(group);
    }
    
    createTwoColumnPanels() {
        // Create panels for sections 1 and 2 (Dataset and Architecture)
        const sectionImages =[
            [this.folder + this.imgNames.confMat,
                 this.folder+this.imgNames.tflite,
                 this.folder+this.imgNames.skeleton],
            [this.folder+this.imgNames.hardware,
                 this.folder+this.imgNames.sketch
                 ,this.folder+this.imgNames.confDist]
        ];

        
        const heights = [[7, 2, 4.75],[3,3.2,3.8]];
        const positions = [
            [ [-7, 0.5, 0.1]
             ,[0 , -2.3 ,0.1]
             ,[ 5.9,-1 ,0.1]
            ],
            [ [-8, 2.2, 0.1]
             ,[ -8.26, -1, 0.1]
             , [-3.1, -1.312, 0.1]
            ]
        ];
        // split into sections:image:coords


        /**
         * const options = {
            custom: true,
            bgWidth: 5,
            bgHeight: 3,
            titleWidth: 5,
            titleHeight: 0.5,
            contentWidth: 5.2,
            contentHeight: 2.6,
            wrapLength: 59,
            fontSize: 18
        };
         */
        const sectionOptions = {
            1:{ 
                bgWidth: 5,
                bgHeight: 2.5,
                titleWidth: 5,
                titleHeight: 0.5,
                contentWidth: 6,
                contentHeight: 3,
                wrapLength: 60,
                fontSize: 18  
            },
            2:{
                custom: true,
                bgWidth: 5,
                bgHeight: 3.5,
                titleWidth: 5,
                titleHeight: 0.5,
                contentWidth: 6,
                contentHeight: 3,
                wrapLength: 60,
                fontSize: 18
            }
        };
        [1, 2].forEach(sectionIndex => {
            const section = this.projectSections[sectionIndex];
            const group = new THREE.Group();
            
            // Section title
            const titleCanvas = this.createTextCanvas(
                section.title,
                600, 60,
                { fontSize: 36, color: '#2563eb', bgColor: 'transparent' }
            );
            const titleMesh = new THREE.Mesh(
                new THREE.PlaneGeometry(6, 0.6),
                new THREE.MeshBasicMaterial({ map: titleCanvas, transparent: true })
            );
            titleMesh.position.y = 4.5;
            group.add(titleMesh);
            
            sectionImages[sectionIndex-1].forEach((imgPath, i) => {
                const imgHeight = heights[sectionIndex - 1][i];
                const imgPos = positions[sectionIndex - 1][i];
                this.ImageLoader.load(imgPath, (image) => {
                    const texture = new THREE.Texture(image);
                    texture.needsUpdate = true;
                    const aspect = image.width / image.height;
                    const imgWidth = imgHeight * aspect;

                    const imgMesh = new THREE.Mesh(
                        new THREE.PlaneGeometry(imgWidth,imgHeight),
                        this.createContrastMaterial(texture, 0.9, 0.01)
                    );
                    imgMesh.position.set(...imgPos);
                    group.add(imgMesh);
                });
            });

            // Create content panels
            // Left column
            const leftPanel = this.createContentPanel(
                section.leftContent.title,
                section.leftContent.text,
                '#f8fafc',
                '#1e40af',
                section.leftContent.imagePath ? section.leftContent.imagePath : null,
                sectionOptions[sectionIndex]
            );
            leftPanel.position.set(0, 2.8, 0.01);
            group.add(leftPanel);
            
            // Right column  
            const rightPanel = this.createContentPanel(
                section.rightContent.title,
                section.rightContent.text,
                '#f8fafc' ,
                '#1e40af',
                section.rightContent.imagePath ? section.rightContent.imagePath : null,
                sectionOptions[sectionIndex]
            );
            rightPanel.position.set(6, 2.8, 0.01);
            group.add(rightPanel);
            
            const extraPText = sectionIndex === 1 ? "To assist users unfamiliar with sign language, I also designed a 'Learning Mode' that allows a user to type in a word supported by the model and view a skeletonised video to learn how to perform the sign. To support this, the main program allocates separate threads to the Translation and Learning modes and listens for a specific input, causing primary function to pause until the Learning mode is exited." :
                "After a training cycle, the best checkpointed models under different metrics were evaluated against the current best model on the test set. If a better configuration was found, additional metadata would be generated, examples include classification reports, confusion matrices and performance plots. Finally, a quantised version of the best model would also be generated using TFLite.      After the first round of training, I also designed an abstract blueprint for a bespoke embedded system that could run the model in real-time.";
            const extraPTitle = sectionIndex === 1 ? "Additional Functionality" : "Post Training";

            const extraPanel = this.createContentPanel(
                extraPTitle,
                extraPText,
                '#f8fafc',
                '#1e40af',
                null,
                { bgWidth: 5, 
                    bgHeight: 2.5,
                    titleWidth: 5,
                    titleHeight: 0.5,
                    contentWidth: 5.5,
                    contentHeight: 2.75,
                    wrapLength: 58,
                    fontSize: 18
                }
            );
            extraPanel.position.set(0, 0.1, 0.01);
            group.add(extraPanel);
            

            group.visible = false;
            this.panels.push(group);
            this.mainGroup.add(group);




        });
    }
    
    createContentPanel(title, content, bgColor, titleColor,img=null, options = {}) {
        const group = new THREE.Group();
        // Panel content - handle text wrapping
        if(img){
            const loader = new THREE.ImageLoader();
            loader.load(img, (image) => {
            
            const texture = new THREE.Texture(image);
            texture.needsUpdate = true;
            
            // Custom shader material for contrast control
            const contrastMaterial = new THREE.ShaderMaterial({
                uniforms: {
                    map: { value: texture },
                    contrast: { value: 1.5 }, // Increase contrast
                    brightness: { value: -0.05 } // Slight brightness boost
                },
                vertexShader: `
                    varying vec2 vUv;
                    void main() {
                        vUv = uv;
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                    }
                `,
                fragmentShader: `
                    uniform sampler2D map;
                    uniform float contrast;
                    uniform float brightness;
                    varying vec2 vUv;
                    
                    void main() {
                        vec4 color = texture2D(map, vUv);
                        // Apply contrast and brightness
                        color.rgb = ((color.rgb - 0.5) * contrast) + 0.5 + brightness;
                        gl_FragColor = color;
                    }
                `
            });
            
            const aspect = image.width / image.height;
            const height = 4;
            const width = height * aspect;
            
            const imgMesh = new THREE.Mesh(
                new THREE.PlaneGeometry(width, height),
                contrastMaterial
            );
            imgMesh.position.x = 0.5;
            imgMesh.position.y = -0.22;
            imgMesh.position.z = 0.02;
            group.add(imgMesh);



            }, undefined, (error) => {
                console.error('Error loading image:', error);
            });
        }else {
            // Background panel
            const bgGeometry = new THREE.PlaneGeometry(options.bgWidth || 6, options.bgHeight || 4.5);
            const bgMaterial = new THREE.MeshBasicMaterial({
                color: bgColor,
                transparent: true,
                opacity: 0.9
            });
            const bgMesh = new THREE.Mesh(bgGeometry, bgMaterial);
            group.add(bgMesh);
            // Border
            const borderGeometry = new THREE.PlaneGeometry((options.bgWidth || 6)+0.1, (options.bgHeight || 4.5)+0.1);
            const borderMaterial = new THREE.MeshBasicMaterial({
                color: this.borderColour,
                transparent: true,
                opacity: 0.5
            });
            const borderMesh = new THREE.Mesh(borderGeometry, borderMaterial);
            borderMesh.position.z = -0.01;
            group.add(borderMesh);

            // Panel title
            const titleCanvas = this.createTextCanvas(
                title,
                500, 50,
                { fontSize: 22, color: titleColor, bgColor: 'transparent' }
            );
            const titleMesh = new THREE.Mesh(
                new THREE.PlaneGeometry(options.titleWidth || 5, options.titleHeight || 0.5),
                new THREE.MeshBasicMaterial({ map: titleCanvas, transparent: true })
            );
            titleMesh.position.y = (options.bgHeight || 4.5)/2 - (options.titleHeight || 0.5)/2 - 0.1;
            titleMesh.position.z = 0.02;
            group.add(titleMesh);
            // Panel content - handle text wrapping
            
            const contentCanvLength = options.contentWidth ? options.contentWidth*104 : 500;

            const wrappedText = this.wrapText(content, options.wrapLength || 45);
            const contentCanvas = this.createMultiLineTextCanvas(
                wrappedText,
                contentCanvLength, contentCanvLength/2,
                { fontSize: options.fontSize || 20, color: '#374151', bgColor: 'transparent' }
            );
            const contentMesh = new THREE.Mesh(
                new THREE.PlaneGeometry(options.contentWidth || 5.5, options.contentHeight || 3),
                new THREE.MeshBasicMaterial({ map: contentCanvas, transparent: true })
            );
            contentMesh.position.x = 0.4;
            contentMesh.position.y = titleMesh.position.y - (options.titleHeight || 0.5)/2 - (options.contentHeight || 3)/2 + 0.1;
            contentMesh.position.z = 0.02;
            group.add(contentMesh);
        }
            
        return group;
    }
    
    createResultsPanel() {
        const section = this.projectSections[3];
        const group = new THREE.Group();
        
        // Section title
        const titleCanvas = this.createTextCanvas(
            section.title,
            600, 60,
            { fontSize: 36, color: '#2563eb', bgColor: 'transparent' }
        );
        const titleMesh = new THREE.Mesh(
            new THREE.PlaneGeometry(6, 0.6),
            new THREE.MeshBasicMaterial({ map: titleCanvas, transparent: true })
        );
        titleMesh.position.y = 4;
        group.add(titleMesh);
        
        // Results section
        const resultsTitle = this.createTextCanvas(
            'Hardware Testing',
            400, 40,
            { fontSize: 22, color: '#059669', bgColor: 'transparent' }
        );
        const resultsTitleMesh = new THREE.Mesh(
            new THREE.PlaneGeometry(4, 0.4),
            new THREE.MeshBasicMaterial({ map: resultsTitle, transparent: true })
        );
        resultsTitleMesh.position.set(-3, 1.8, 0.01);
        group.add(resultsTitleMesh);
        
        // Results list
        section.content.results.forEach((result, i) => {
            const resultCanvas = this.createTextCanvas(
                `✓ ${result}`,
                500, 35,
                { fontSize: 16, color: '#065f46', bgColor: 'transparent', align: 'left' }
            );
            const resultMesh = new THREE.Mesh(
                new THREE.PlaneGeometry(5, 0.35),
                new THREE.MeshBasicMaterial({ map: resultCanvas, transparent: true })
            );
            resultMesh.position.set(-3, 1.3 - i * 0.4, 0.01);
            group.add(resultMesh);
        });
        
        // Future work section
        const futureTitle = this.createTextCanvas(
            'Future Work',
            400, 40,
            { fontSize: 22, color: '#7c3aed', bgColor: 'transparent' }
        );
        const futureTitleMesh = new THREE.Mesh(
            new THREE.PlaneGeometry(4, 0.4),
            new THREE.MeshBasicMaterial({ map: futureTitle, transparent: true })
        );
        futureTitleMesh.position.set(3, 1.8, 0.01);
        group.add(futureTitleMesh);
        
        // Future work list
        section.content.futureWork.forEach((work, i) => {
            const workCanvas = this.createTextCanvas(
                `→ ${work}`,
                500, 35,
                { fontSize: 16, color: '#5b21b6', bgColor: 'transparent', align: 'left' }
            );
            const workMesh = new THREE.Mesh(
                new THREE.PlaneGeometry(5, 0.35),
                new THREE.MeshBasicMaterial({ map: workCanvas, transparent: true })
            );
            workMesh.position.set(3, 1.3 - i * 0.4, 0.01);
            group.add(workMesh);
        });
        
        group.visible = false;
        this.panels.push(group);
        this.mainGroup.add(group);
    }
    
    createNavigationButtons() {
        const buttonGroup = new THREE.Group();
        buttonGroup.position.y = -3.5;
        buttonGroup.position.z = 1;
        
        const buttonLabels = ['Overview', 'Data & Pipeline', 'Architecture', 'Results'];
        
        buttonLabels.forEach((label, i) => {
            const geometry = new THREE.BoxGeometry(2.8, 0.6, 0.2);
            const material = new THREE.MeshStandardMaterial({
                color: i === 0 ? 0x2563eb : 0x64748b,
                emissive: i === 0 ? 0x1e40af : 0x000000,
                emissiveIntensity: 0.2
            });
            
            const button = new THREE.Mesh(geometry, material);
            button.position.x = (i - 1.5) * 3.2;
            button.userData = { viewIndex: i, isButton: true };
            
            // Button text
            const textCanvas = this.createTextCanvas(label, 280, 60, { 
                fontSize: 16, 
                color: i === 0 ? '#ffffff' : '#e2e8f0' 
            });
            const textMesh = new THREE.Mesh(
                new THREE.PlaneGeometry(2.6, 0.5),
                new THREE.MeshBasicMaterial({ map: textCanvas, transparent: true })
            );
            textMesh.position.z = 0.11;
            button.add(textMesh);
            
            this.makeInteractive(button);
            buttonGroup.add(button);
        });
        
        this.navigationButtons = buttonGroup;
        this.mainGroup.add(buttonGroup);
    }
    
    createTextCanvas(text, width, height, options = {}) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        const scale = window.devicePixelRatio || 1;
        canvas.width = width * scale;
        canvas.height = height * scale;

        ctx.scale(scale, scale);
        ctx.imageSmoothingEnabled = true;
            
        if (options.bgColor && options.bgColor !== 'transparent') {
            ctx.fillStyle = options.bgColor;
            ctx.fillRect(0, 0, width, height);
        }
        
        ctx.fillStyle = options.color || '#ffffff';
        ctx.font = `${options.fontSize || 20}px Arial`;
        ctx.textAlign = options.align || 'center';
        ctx.textBaseline = 'middle';
        
        if (options.wrap && options.align === 'left') {
            // Handle wrapped text for left alignment
            const lines = this.wrapText(text, 40);
            const lineHeight = options.fontSize * 1.2;
            const startY = (height - (lines.length * lineHeight)) / 2 + lineHeight / 2;
            
            lines.forEach((line, i) => {
                ctx.fillText(line, 20, startY + i * lineHeight);
            });
        } else {
            const x = options.align === 'left' ? 20 : width / 2;
            ctx.fillText(text, x, height / 2);
        }
            
        const tex = new THREE.CanvasTexture(canvas);
        tex.minFilter = THREE.LinearFilter;
        tex.magFilter = THREE.LinearFilter;
        tex.anisotropy = this.renderer.capabilities.getMaxAnisotropy();
        tex.needsUpdate = true;

        return tex;
    }
    
    createMultiLineTextCanvas(lines, width, height, options = {}) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        const scale = window.devicePixelRatio || 1;
        canvas.width = width * scale;
        canvas.height = height * scale;

        ctx.scale(scale, scale);
        ctx.imageSmoothingEnabled = true;
            
        if (options.bgColor && options.bgColor !== 'transparent') {
            ctx.fillStyle = options.bgColor;
            ctx.fillRect(0, 0, width, height);
        }
        
        ctx.fillStyle = options.color || '#ffffff';
        ctx.font = `${options.fontSize || 18}px Arial`;
        ctx.textAlign = 'left';
        
        const lineHeight = options.fontSize * 1.3;
        const startY = options.fontSize + 10;
        
        lines.forEach((line, i) => {
            ctx.fillText(line, 20, startY + i * lineHeight);
        });
            
        const tex = new THREE.CanvasTexture(canvas);
        tex.minFilter = THREE.LinearFilter;
        tex.magFilter = THREE.LinearFilter;
        tex.anisotropy = this.renderer.capabilities.getMaxAnisotropy();
        tex.needsUpdate = true;

        return tex;
    }
    
    wrapText(text, maxCharsPerLine) {
        const words = text.split(' ');
        const lines = [];
        let currentLine = '';
        let testLine;
        words.forEach(word => {
            testLine = currentLine + (currentLine ? ' ' : '') + word;
            if (testLine.length <= maxCharsPerLine) {
                currentLine = testLine; // add word to current line
            } else {
                if (currentLine) {
                    //if current line has content, push it
                    lines.push(currentLine);
                    currentLine = word;
                }
                currentLine = word; // if word longer than max, it will be on its own line
            }
        });
        
        if (currentLine) lines.push(currentLine); // last line
        return lines;
    }
    
    showView(index) {
        // Show the correct panel
        this.panels.forEach((panel, i) => {
            panel.visible = (i === index);
        });

        // Update button states
        if (this.navigationButtons) {
            this.navigationButtons.children.forEach((button, i) => {
                const isActive = i === index;

                button.material.color.setHex(isActive ? 0x2563eb : 0x64748b);
                button.material.emissive = new THREE.Color(isActive ? 0x1e40af : 0x000000);
                button.material.emissiveIntensity = isActive ? 0.2 : 0.0;
                
                const textMesh = button.children[0];
                if (textMesh) {
                    const buttonLabels = ['Overview', 'Data & Pipeline', 'Architecture', 'Results'];
                    const textCanvas = this.createTextCanvas(
                        buttonLabels[i], 
                        280, 60, 
                        { 
                            fontSize: 16, 
                            color: isActive ? '#ffffff' : '#e2e8f0' 
                        }
                    );
                    textMesh.material.map = textCanvas;
                    textMesh.material.needsUpdate = true;
                }
            });
        }

        this.currentView = index;
    }
    
    onObjectClick(intersection) {
        const object = intersection.object;
        if (object.userData && object.userData.isButton) {
            this.showView(object.userData.viewIndex);
        }
    }
    
    onMouseIntersect(intersects) {
        // Reset all buttons
        if (this.navigationButtons) {
            this.navigationButtons.children.forEach(button => {
                button.userData.isHovered = false;
            });
        }
        
        // Check for button hover
        if (intersects.length > 0) {
            const object = intersects[0].object;
            if (object.userData && object.userData.isButton) {
                object.userData.isHovered = true;
                document.body.style.cursor = 'pointer';
            } else {
                document.body.style.cursor = 'default';
            }
        } else {
            document.body.style.cursor = 'default';
        }
    }
    
    animate(deltaTime, elapsedTime) {
        super.animate(deltaTime, elapsedTime);
        
        // Hover effect for buttons
        if (this.navigationButtons) {
            this.navigationButtons.children.forEach(button => {
                if (button.userData.isHovered) {
                    button.scale.setScalar(1.05);
                } else {
                    button.scale.setScalar(1);
                }
            });
        }
    }
    
    onShow() {
        console.log('Sign Language Project active');
        if (this.mainGroup) {
            this.mainGroup.visible = true;
        }
        this.showView(0);
        
        // Animate in
        if (this.mainGroup) {
            this.mainGroup.scale.setScalar(0);
            const animateIn = () => {
                const scale = this.mainGroup.scale.x;
                const newScale = scale + (1 - scale) * 0.1;
                this.mainGroup.scale.setScalar(newScale);
                
                if (Math.abs(newScale - 1) > 0.01) {
                    requestAnimationFrame(animateIn);
                }
            };
            animateIn();
        }
    }
    
    onHide() {
        if (this.mainGroup) {
            this.mainGroup.visible = false;
        }
        document.body.style.cursor = 'default';
    }
}

export { SignLanguageProject };
/*       
        this.warningsExample1 =`Compiler Alerts:
[0;33mWarning for:[0m 'result'
[0;36mBE AWARE: [0m Return statement in block at line 18 column 10[0m
`;
 */
class CompilerProject extends Project {
    constructor(scene, camera, renderer) {
        super(scene, camera, renderer, {
            name: 'C Compiler',
            autoRotate: false,
            animationSpeed: 0.5,
            responsive: true
        });
        
        this.currentView = 0;
        this.panels = [];
        this.mainGroup = null;
        
        this.exampleIndex = 0
        // Store your example data
        this.examples = [
            {
                title: 'Control Flow',
                description: 'While loop compilation',
                sourceCode: `extern int print_int(int X);

int test;
float f;
bool b;

int While(int n){
  int result;
  test = 11 + 1;
  result = 0;
  print_int(test); 
  while(result < 10)
    result = result + 1;  
    //print_int(result);    
   
  return result;
}`,
                astContent: `
Program
├──ExternDef: type='int' name: 'print_int'
│   └──Param='X' with type: 'int'
├──VarDec='test'with type='int'
├──VarDec='f'with type='float'
├──VarDec='b'with type='bool'
└──FuncDec: type='int' name: 'While'
│   ├──Param='n' with type: 'int'
│   ├──VarDec='result'with type='int'
│   ├──VarCall for:'test'
│   │   └──BinaryExpr:
│   │   │   └──IntLIT='11'
│   │   │   ├──Operator='+'
│   │   │   └──IntLIT='1'
│   ├──VarCall for:'result'
│   │   └──IntLIT='0'
│   ├──Function call for: 'print_int'
│   │   └──Arg(s)
│   │   │   └──Variable= 'test'
│   ├──While
│   │   ├──BinaryExpr:
│   │   │   ├──Variable= 'result'
│   │   │   ├──Operator='<'
│   │   │   └──IntLIT='10'
│   │   └──VarCall for:'result'
│   │   │   └──BinaryExpr:
│   │   │   │   ├──Variable= 'result'
│   │   │   │   ├──Operator='+'
│   │   │   │   └──IntLIT='1'
│   └──Return with value:
│   │   └──Variable= 'result'
`,
                irContent: `:
; ModuleID = 'mini-c'
source_filename = "mini-c"

@test = common global i32 0
@f = common global float 0.000000e+00
@b = common global i1 false

declare i32 @print_int(i32)

define i32 @While(i32 %n) {
"Func entry":
  %result = alloca i32, align 4
  %n1 = alloca i32, align 4
  store i32 %n, ptr %n1, align 4
  store i32 0, ptr %result, align 4
  store i32 12, ptr @test, align 4
  %test = load i32, ptr @test, align 4
  store i32 0, ptr %result, align 4
  %test2 = load i32, ptr @test, align 4
  %print_int = call i32 @print_int(i32 %test2)
  br label %condwhile

condwhile:                                        ; preds = %loopwhile, %"Func entry"
  %result3 = load i32, ptr %result, align 4
  %iLTtmp = icmp slt i32 %result3, 10
  %whilecond = icmp ne i1 %iLTtmp, false
  br i1 %whilecond, label %loopwhile, label %afterwhile

loopwhile:                                        ; preds = %condwhile
  %result4 = load i32, ptr %result, align 4
  %addtmp = add i32 %result4, 1
  store i32 %addtmp, ptr %result, align 4
  br label %condwhile

afterwhile:                                       ; preds = %condwhile
  %result5 = load i32, ptr %result, align 4
  ret i32 %result5
}
`
            }
            ,
            {
                title: `Recursion`,
                description: `Sum of Natural Numbers using Recursion`,
                sourceCode: `extern int print_int(int X);

int addNumbers(int n)
{
    int result;
    result = 0;

    if(n != 0) {

        result = n + addNumbers(n-1);
    }
    else {
        result  = n;
    }
    print_int(result);
    return result;
}

int recursion_driver(int num) {    
    return addNumbers(num);    
}

`,
                astContent: `
Program
├──ExternDef: type='int' name: 'print_int'
│   └──Param='X' with type: 'int'
├──FuncDec: type='int' name: 'addNumbers'
│   ├──Param='n' with type: 'int'
│   ├──VarDec='result'with type='int'
│   ├──VarCall for:'result'
│   │   └──IntLIT='0'
│   ├──If Stmt
│   │   ├──Condition
│   │   │   └──BinaryExpr:
│   │   │   │   ├──Variable= 'n'
│   │   │   │   ├──Operator='!='
│   │   │   │   └──IntLIT='0'
│   │   ├──Then
│   │   │   └──VarCall for:'result'
│   │   │   │   └──BinaryExpr:
│   │   │   │   │   ├──Variable= 'n'
│   │   │   │   │   ├──Operator='+'
│   │   │   │   │   └──Function call for: 'addNumbers'
│   │   │   │   │   │   └──Arg(s)
│   │   │   │   │   │   │   └──BinaryExpr:
│   │   │   │   │   │   │   │   ├──Variable= 'n'
│   │   │   │   │   │   │   │   ├──Operator='-'
│   │   │   │   │   │   │   │   └──IntLIT='1'
│   │   └──Else
│   │   │   └──VarCall for:'result'
│   │   │   │   └──Variable= 'n'
│   ├──Function call for: 'print_int'
│   │   └──Arg(s)
│   │   │   └──Variable= 'result'
│   └──Return with value:
│   │   └──Variable= 'result'
└──FuncDec: type='int' name: 'recursion_driver'
│   ├──Param='num' with type: 'int'
│   └──Return with value:
│   │   └──Function call for: 'addNumbers'
│   │   │   └──Arg(s)
│   │   │   │   └──Variable= 'num'
`,
                irContent: `; ModuleID = 'mini-c'
source_filename = "mini-c"

declare i32 @print_int(i32)

define i32 @addNumbers(i32 %n) {
"Func entry":
  %result = alloca i32, align 4
  %n1 = alloca i32, align 4
  store i32 %n, ptr %n1, align 4
  store i32 0, ptr %result, align 4
  store i32 0, ptr %result, align 4
  %n2 = load i32, ptr %n1, align 4
  %icmpnetmp = icmp ne i32 %n2, 0
  %ifcond = icmp ne i1 %icmpnetmp, false
  br i1 %ifcond, label %if, label %else

if:                                               ; preds = %"Func entry"
  %n3 = load i32, ptr %n1, align 4
  %n4 = load i32, ptr %n1, align 4
  %isubtmp = sub i32 %n4, 1
  %addNumbers = call i32 @addNumbers(i32 %isubtmp)
  %addtmp = add i32 %n3, %addNumbers
  store i32 %addtmp, ptr %result, align 4
  br label %ifcont

else:                                             ; preds = %"Func entry"
  %n5 = load i32, ptr %n1, align 4
  store i32 %n5, ptr %result, align 4
  br label %ifcont

ifcont:                                           ; preds = %else, %if
  %result6 = load i32, ptr %result, align 4
  %print_int = call i32 @print_int(i32 %result6)
  %result7 = load i32, ptr %result, align 4
  ret i32 %result7
}

define i32 @recursion_driver(i32 %num) {
"Func entry":
  %num1 = alloca i32, align 4
  store i32 %num, ptr %num1, align 4
  %num2 = load i32, ptr %num1, align 4
  %addNumbers = call i32 @addNumbers(i32 %num2)
  ret i32 %addNumbers
}
`
            }
            ,
            {
                title: `Void Return`,
                description : `Function to check void return handling`,
                sourceCode: `extern int print_int(int X);

void Void(void){
  int result;
  result = 0;
  print_int(result);
  while(result < 10) {
    result = result + 1;
    print_int(result);
  }

  return;
}`,
                astContent: `Program
├──ExternDef: type='int' name: 'print_int'
│   └──Param='X' with type: 'int'
└──FuncDec: type='void' name: 'Void'
│   ├──VarDec='result'with type='int'
│   ├──VarCall for:'result'
│   │   └──IntLIT='0'
│   ├──Function call for: 'print_int'
│   │   └──Arg(s)
│   │       └──Variable= 'result'
│   ├──While
│   │   ├──BinaryExpr:
│   │   │   ├──Variable= 'result'
│   │   │   │   ├──Operator='<'
│   │   │   │   └──IntLIT='10'
│   │   │   ├──VarCall for:'result'
│   │   │   │   └──BinaryExpr:
│   │   │   │   │   ├──Variable= 'result'
│   │   │   │   │   ├──Operator='+'
│   │   │   │   │   └──IntLIT='1'
│   │   │   └──Function call for: 'print_int'
│   │   │   │   └──Arg(s)
│   │   │   │       └──Variable= 'result'
│   └──Return
`,
                irContent: `; ModuleID = 'mini-c'
source_filename = "mini-c"

declare i32 @print_int(i32)

define void @Void() {
"Func entry":
  %result = alloca i32, align 4
  store i32 0, ptr %result, align 4
  store i32 0, ptr %result, align 4
  %result1 = load i32, ptr %result, align 4
  %print_int = call i32 @print_int(i32 %result1)
  br label %condwhile

condwhile:                                        ; preds = %loopwhile, %"Func entry"
  %result2 = load i32, ptr %result, align 4
  %iLTtmp = icmp slt i32 %result2, 10
  %whilecond = icmp ne i1 %iLTtmp, false
  br i1 %whilecond, label %loopwhile, label %afterwhile

loopwhile:                                        ; preds = %condwhile
  %result3 = load i32, ptr %result, align 4
  %addtmp = add i32 %result3, 1
  store i32 %addtmp, ptr %result, align 4
  %result4 = load i32, ptr %result, align 4
  %print_int5 = call i32 @print_int(i32 %result4)
  br label %condwhile

afterwhile:                                       ; preds = %condwhile
  ret void
}
`,
            }
        ];
    }
    
    create() {
        this.mainGroup = new THREE.Group();
        
        // Create the overview panel
        this.createOverviewPanel();
        
        // Create example panels
        this.createExamplePanels();
        
        // Create navigation
        this.createNavigationButtons();
        
        // Create pipeline visualization
        //this.createPipelineVisualization(this.mainGroup);
        
        this.addObject(this.mainGroup);
        
        // Show initial view
        this.showView(0);
    }
    
    createOverviewPanel() {
        const group = new THREE.Group();
        
        // Main title
        const titleCanvas = this.createTextCanvas(
            'C Compiler Implementation',
            800, 100,
            { fontSize: 48, color: '#00ff88', bgColor: 'transparent' }
        );
        const titleMesh = new THREE.Mesh(
            new THREE.PlaneGeometry(8, 1),
            new THREE.MeshBasicMaterial({ map: titleCanvas, transparent: true })
        );
        titleMesh.position.y = 3;
        group.add(titleMesh);
        
        // Feature list
        // Create two columns of features
        const leftFeatures = [
            'Lexical Analysis & Tokenization',
            'Recursive Descent Parser',
            'Abstract Syntax Tree Generation',
            'Semantic Analysis'
        ];
        
        const rightFeatures = [
            'LLVM IR Code Generation',
            'Control Flow Support',
            'Function Calls & Parameters',
        
        ];
        
        // Left column
        leftFeatures.forEach((feature, i) => {
            const featureCanvas = this.createTextCanvas(
                `• ${feature}`,
                400, 40,
                { fontSize: 18, color: '#ffffff', bgColor: 'transparent', align: 'left' }
            );
            const featureMesh = new THREE.Mesh(
                new THREE.PlaneGeometry(4, 0.4),
                new THREE.MeshBasicMaterial({ map: featureCanvas, transparent: true })
            );
            featureMesh.position.set(-3, 1 - i * 0.5, 0);
            group.add(featureMesh);
        });
        
        // Right column
        rightFeatures.forEach((feature, i) => {
            const featureCanvas = this.createTextCanvas(
                `• ${feature}`,
                400, 40,
                { fontSize: 18, color: '#ffffff', bgColor: 'transparent', align: 'left' }
            );
            const featureMesh = new THREE.Mesh(
                new THREE.PlaneGeometry(4, 0.4),
                new THREE.MeshBasicMaterial({ map: featureCanvas, transparent: true })
            );
            featureMesh.position.set(3, 1 - i * 0.5, 0);
            group.add(featureMesh);
        });
        
        //this.createPipelineVisualization(group);

        group.visible = true;
        this.panels.push(group);
        this.mainGroup.add(group);
    }
    
    createExamplePanels() {
        const fontSizes = [32,30,32]
        this.examples.forEach((example, index) => {
            const exampleGroup = new THREE.Group();
            const titleCanvas = this.createTextCanvas(
                example.title,
                400, 50,
                { fontSize: 32, color: '#68897aff', bgColor: 'transparent' }
            );
            const titleMesh = new THREE.Mesh(
                new THREE.PlaneGeometry(4, 0.5),
                new THREE.MeshBasicMaterial({ map: titleCanvas, transparent: true })
            );
            titleMesh.position.y = 4;
            exampleGroup.add(titleMesh);

            const panelWidth = 4.5;
            const panelHeight = 6;
            const spacing = 5.5;
            
            // Source code panel (left)
            const codePanel = this.createCodePanel(
                example.sourceCode,
                'Source Code',
                '#1a1a2e',
                panelWidth,
                panelHeight,
                this.renderer
            );
            codePanel.position.set(-spacing, 0, 0);
            exampleGroup.add(codePanel);
            
            // AST panel (center)
            const astPanel = this.createCodePanel(
                example.astContent,
                'Abstract Syntax Tree',
                '#16213e',
                panelWidth,
                panelHeight,
                this.renderer
            );
            astPanel.position.set(0, 0, 0);
            exampleGroup.add(astPanel);
            
            // IR panel (right)
            const irPanel = this.createCodePanel(
                example.irContent,
                'LLVM IR',
                '#0f3460',
                panelWidth,
                panelHeight,
                this.renderer,
                fontSizes[index]
            );
            irPanel.position.set(spacing, 0, 0);
            exampleGroup.add(irPanel);
            
            // Add flow arrows between panels
            this.createFlowArrows(exampleGroup, spacing);
        
            exampleGroup.scale.setScalar(1.2);

            exampleGroup.visible = false;
            this.panels.push(exampleGroup);
            this.mainGroup.add(exampleGroup);
        
        });
    }
    
    createCodePanel(content, title, bgColor, panelWidth, panelHeight, renderer, fontSize = 32) {
        const group = new THREE.Group();
        
        // Background
        const bgGeometry = new THREE.PlaneGeometry(panelWidth, panelHeight);
        const bgMaterial = new THREE.MeshBasicMaterial({
            color: new THREE.Color(bgColor),
            transparent: true,
            opacity: 0.9
        });
        const bgMesh = new THREE.Mesh(bgGeometry, bgMaterial);
        group.add(bgMesh);
        
        // Border
        const borderGeometry = new THREE.PlaneGeometry(panelWidth+0.1, panelHeight+0.1);
        const borderMaterial = new THREE.MeshBasicMaterial({
            color: 0x682546,
            transparent: true,
            opacity: 0.4
        });
        const borderMesh = new THREE.Mesh(borderGeometry, borderMaterial);
        borderMesh.position.z = -0.01;
        group.add(borderMesh);
        
        // Title
        const titleCanvas = document.createElement('canvas');
        const titleCtx = titleCanvas.getContext('2d');
        titleCanvas.width = 800;
        titleCanvas.height = 80;
        titleCtx.imageSmoothingEnabled = true;
        
        titleCtx.fillStyle = '#ffffffff';
        titleCtx.font = 'bold 64px centaur';
        titleCtx.textAlign = 'center';
        titleCtx.fillText(title, titleCanvas.width/2, titleCanvas.height/2);

        const titleTexture = new THREE.CanvasTexture(titleCanvas);
        titleTexture.minFilter = THREE.LinearFilter;
        titleTexture.magFilter = THREE.LinearFilter;
        titleTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();
        titleTexture.needsUpdate = true;

        const titleMesh = new THREE.Mesh(
            new THREE.PlaneGeometry(panelWidth-0.2, 0.4),
            new THREE.MeshBasicMaterial({ map: titleTexture, transparent: true })
        );
        titleMesh.position.y = panelHeight/2 - 0.3;
        titleMesh.position.z = 0.01;
        group.add(titleMesh);
        
        // Code content
        // Code content - create higher resolution canvas
        const codeCanvas = document.createElement('canvas');
        const ctx = codeCanvas.getContext('2d');
        
        // Much higher resolution for sharp text
        const canvasScale = window.devicePixelRatio || 1;
        const pxW = 1000 * canvasScale;
        const pxH = 1400 * canvasScale;
        
        codeCanvas.width = pxW;
        codeCanvas.height = pxH;

        ctx.scale(canvasScale, canvasScale);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, pxW/canvasScale, pxH/canvasScale);
        
        ctx.font = `${fontSize}px Consolas, monospace`;
        const lines = content.split('\n');
        
        lines.forEach((line, i) => {
            const y = 30 + i * fontSize-2; //line height
            if (y > pxH/canvasScale - 20) return; // Don't draw beyond canvas
            
            // Apply syntax highlighting
            if (title.includes('Source')) {
                if (line.includes('//')) {
                    ctx.fillStyle = '#6a9955';
                } else if (line.match(/\b(int|float|bool|extern|while|return|if|else)\b/)) {
                    ctx.fillStyle = '#569cd6';
                } else {
                    ctx.fillStyle = '#d4d4d4';
                }
            } else if (line.includes('├') || line.includes('└')) {
                ctx.fillStyle = '#888888';
            } else if (line.includes('define') || line.includes('%')) {
                ctx.fillStyle = '#9cdcfe';
            } else {
                ctx.fillStyle = '#ffffff';
            }
            
            ctx.fillText(line.substring(0, 55), 20, y);
        });
        
        const codeTexture = new THREE.CanvasTexture(codeCanvas);
        codeTexture.minFilter = THREE.LinearFilter;
        codeTexture.magFilter = THREE.LinearFilter;
        codeTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();
        codeTexture.needsUpdate = true;

        const codeMesh = new THREE.Mesh(
            new THREE.PlaneGeometry(panelWidth - 0.3, panelHeight - 1),
            new THREE.MeshBasicMaterial({ map: codeTexture, transparent: true })
        );
        codeMesh.position.y = -0.3;
        codeMesh.position.z = 0.01;
        group.add(codeMesh);
        
    return group;
    }
    
    createCodeCanvas(content, isSourceCode = false, panelWidth=4) {
        const scale = panelWidth / 4;
        
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 1200*scale;
        canvas.height = 1600*scale;
        
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.font = `16px monospace`;
        const lines = content.split('\n');
        
        lines.forEach((line, i) => {
            const y = 25 + i * 20;
            
            if (isSourceCode) {
                // Syntax highlighting for C code
                if (line.includes('//')) {
                    ctx.fillStyle = '#6a9955'; // Comments
                } else if (line.match(/\b(int|float|bool|extern|while|return|if|else)\b/)) {
                    ctx.fillStyle = '#569cd6'; // Keywords
                } else if (line.match(/\d+/)) {
                    ctx.fillStyle = '#b5cea8'; // Numbers
                } else {
                    ctx.fillStyle = '#d4d4d4'; // Default
                }
            } else if (line.includes('├') || line.includes('└') || line.includes('│')) {
                // AST tree structure
                ctx.fillStyle = '#888888';
            } else if (line.includes('define') || line.includes('br') || line.includes('ret')) {
                // LLVM IR keywords
                ctx.fillStyle = '#c586c0';
            } else if (line.includes('%')) {
                // LLVM variables
                ctx.fillStyle = '#9cdcfe';
            } else {
                ctx.fillStyle = '#ffffff';
            }
            

            const maxChars = Math.floor(45);
            const displayLine = line.substring(0, maxChars);
            ctx.fillText(displayLine, 15, y);        
        });
        
        return new THREE.CanvasTexture(canvas);
    }
    
    createTextCanvas(text, width, height, options = {}) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        const scale = window.devicePixelRatio || 1;
        canvas.width = width * scale;
        canvas.height = height * scale;

        ctx.scale(scale, scale);
        ctx.imageSmoothingEnabled = true;
            
        if (options.bgColor && options.bgColor !== 'transparent') {
            ctx.fillStyle = options.bgColor;
            ctx.fillRect(0, 0, width, height);
        }
        
        ctx.fillStyle = options.color || '#ffffff';
        ctx.font = `${options.fontSize || 20}px Arial`;
        ctx.textAlign = options.align || 'center';
        ctx.textBaseline = 'middle';
        
        const x = options.align === 'left' ? 20 : width / 2;
        ctx.fillText(text, x, height / 2);
            
        const tex = new THREE.CanvasTexture(canvas);
        tex.minFilter = THREE.LinearFilter;
        tex.magFilter = THREE.LinearFilter;
        tex.anisotropy = this.renderer.capabilities.getMaxAnisotropy();
        tex.needsUpdate = true;

        return tex;
    }
    
    createNavigationButtons() {
        const buttonGroup = new THREE.Group();
        buttonGroup.position.y = -3.8;
        buttonGroup.position.z = 1;
        const buttons = ['Overview', ...this.examples.map(e=>e.title), 'Next'];
        
        buttons.forEach((text, i) => {
            const geometry = new THREE.BoxGeometry(2.2, 0.6, 0.2);
            const material = new THREE.MeshStandardMaterial({
                color: i === 0 ? 0x00ff88 : 0x444444,
                emissive: i === 0 ? 0x00ff88 : 0x000000,
                emissiveIntensity: 0.2
            });
            
            const button = new THREE.Mesh(geometry, material);
            button.position.x = (i - 2) * 2.5;

            // 👇 Correct mapping
            if (i === 0) {
                button.userData = { viewIndex: 0, isButton: true }; // Overview
            } else if (i === buttons.length - 1) {
                button.userData = { isNext: true, isButton: true }; // Next
            } else {
                button.userData = { viewIndex: i, isButton: true }; // Example panels (1..n)
            }
            // Button text
            const textCanvas = this.createTextCanvas(text, 220, 60, { 
                fontSize: 18, 
                color: i === 0 ? '#000000' : '#ffffff' 
            });
            const textMesh = new THREE.Mesh(
                new THREE.PlaneGeometry(2.1, 0.5),
                new THREE.MeshBasicMaterial({ map: textCanvas, transparent: true })
            );
            textMesh.position.z = 0.11;
            button.add(textMesh);
            
            // Make button interactive
            this.makeInteractive(button);
            buttonGroup.add(button);
        });
        
        this.navigationButtons = buttonGroup;
        this.mainGroup.add(buttonGroup);
    }
    
    createPipelineVisualization(parentGroup) {
        const pipelineGroup = new THREE.Group();
        pipelineGroup.position.y = -2;
        
        const stages = ['Lexer', 'Parser', 'AST', 'LLVM IR', 'Assembly'];
        const colors = [0xff6b6b, 0x4ecdc4, 0x45b7d1, 0xf9ca24, 0x00ff88];
        
        stages.forEach((stage, i) => {
            // Stage box
            const geometry = new THREE.BoxGeometry(1.2, 0.6, 0.3);
            const material = new THREE.MeshStandardMaterial({ 
                color: colors[i],
                emissive: colors[i],
                emissiveIntensity: 0.1
            });
            const box = new THREE.Mesh(geometry, material);
            box.position.x = (i - 2) * 2;
            
            // Stage label
            const labelCanvas = this.createTextCanvas(stage, 120, 30, { fontSize: 14 });
            const labelMesh = new THREE.Mesh(
                new THREE.PlaneGeometry(1.1, 0.3),
                new THREE.MeshBasicMaterial({ map: labelCanvas, transparent: true })
            );
            labelMesh.position.z = 0.16;
            box.add(labelMesh);
            
            pipelineGroup.add(box);
            
            // Arrow to next stage
            if (i < stages.length - 1) {
                const arrowGeometry = new THREE.ConeGeometry(0.15, 0.4, 4);
                const arrow = new THREE.Mesh(arrowGeometry, material);
                arrow.position.x = box.position.x + 1;
                arrow.rotation.z = -Math.PI / 2;
                pipelineGroup.add(arrow);
            }
        });
        
        this.pipeline = pipelineGroup;
        parentGroup.add(pipelineGroup);
    }
    
    createFlowArrows(group, spacing) {
        const arrowGeometry = new THREE.ConeGeometry(0.15, 0.4, 4);
        const arrowMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x00ff88,
            emissive: 0x00ff88,
            emissiveIntensity: 0.3
        });
        
        // Arrow from source to AST
        const arrow1 = new THREE.Mesh(arrowGeometry, arrowMaterial);
        arrow1.position.set(-spacing/2 + 0.15, 0, 0.5);
        arrow1.rotation.z = -Math.PI / 2;
        group.add(arrow1);
        
        // Arrow from AST to IR
        const arrow2 = new THREE.Mesh(arrowGeometry, arrowMaterial);
        arrow2.position.set(spacing/2 - 0.15, 0, 0.5);
        arrow2.rotation.z = -Math.PI / 2;
        group.add(arrow2);
        
        this.arrows = [arrow1, arrow2];
    }
    showView(index) {
    // Show the correct panel
    this.panels.forEach((panel, i) => {
        panel.visible = (i === index);
    });

    // Update button states
    if (this.navigationButtons) {
        this.navigationButtons.children.forEach((button, i) => {
            const isNext = button.userData && button.userData.isNext;
            const isActive = button.userData && button.userData.viewIndex === index;

            if (isNext) {
                // Next button: always faint glow
                button.material.color.setHex(0x444444);
                button.material.emissive = new THREE.Color(0x00ff88);
                button.material.emissiveIntensity = 0.1; // faint glow
            } else {
                // Normal buttons: highlight if active
                button.material.color.setHex(isActive ? 0x00ff88 : 0x444444);
                button.material.emissive = new THREE.Color(isActive ? 0x00ff88 : 0x000000);
                button.material.emissiveIntensity = isActive ? 0.2 : 0.0;
            }
            const textMesh = button.children[0];
            if (textMesh) {
                const text = (i === 0) ? 'Overview' :
                             (i === this.navigationButtons.children.length - 1) ? 'Next →' :
                             this.examples[i - 1].title;
                const textCanvas = this.createTextCanvas(text, 220, 60, { 
                    fontSize: 18, 
                    color: isActive ? '#000000' : '#ffffff' 
                });
                textMesh.material.map = textCanvas;
                textMesh.material.needsUpdate = true;
            }
        });
    }

    this.currentView = index;
    }
    
    onObjectClick(intersection) {
        const object = intersection.object;
        if (object.userData && object.userData.isButton) {
            let viewIndex = object.userData.viewIndex;
            // If "Next" button clicked on overview, go to example
            if (object.userData.isNext) {
                const next = (this.currentView +1) % this.panels.length;
                this.showView(next);
            } 
            else{
                this.showView(object.userData.viewIndex);
            }
        }
    }
    
    animate(deltaTime, elapsedTime) {
        super.animate(deltaTime, elapsedTime);
        
        // Animate pipeline boxes
        if (this.pipeline) {
            this.pipeline.children.forEach((child, i) => {
                if (child.geometry.type === 'BoxGeometry') {
                    const pulse = Math.sin(elapsedTime * 2 + i * 0.5) * 0.05;
                    child.scale.y = 1 + pulse;
                }
            });
        }
        
        // Pulse flow arrows
        if (this.arrows) {
            this.arrows.forEach((arrow, i) => {
                const pulse = Math.sin(elapsedTime * 3 + i * Math.PI) * 0.1 + 1;
                arrow.scale.setScalar(pulse);
            });
        }
        
        // Hover effect for buttons
        if (this.navigationButtons) {
            this.navigationButtons.children.forEach(button => {
                if (button.userData.isHovered) {
                    button.scale.setScalar(1.05);
                } else {
                    button.scale.setScalar(1);
                }
            });
        }
    }
    
    onMouseIntersect(intersects) {
        // Reset all buttons
        if (this.navigationButtons) {
            this.navigationButtons.children.forEach(button => {
                button.userData.isHovered = false;
            });
        }
        
        // Check for button hover
        if (intersects.length > 0) {
            const object = intersects[0].object;
            if (object.userData && object.userData.isButton) {
                object.userData.isHovered = true;
                document.body.style.cursor = 'pointer';
            } else {
                document.body.style.cursor = 'default';
            }
        } else {
            document.body.style.cursor = 'default';
        }
    }
    
    onShow() {
        console.log('Compiler Project active');
        this.showView(0);
        
        // Animate in
        this.mainGroup.scale.setScalar(0);
        const animateIn = () => {
            const scale = this.mainGroup.scale.x;
            const newScale = scale + (1 - scale) * 0.1;
            this.mainGroup.scale.setScalar(newScale);
            
            if (Math.abs(newScale - 1) > 0.01) {
                requestAnimationFrame(animateIn);
            }
        };
        animateIn();
    }
    
    onHide() {
        document.body.style.cursor = 'default';
    }
}

export {CompilerProject};


class InteractiveGallery extends Project {
    constructor(scene, camera, renderer, projectsMap) {
        super(scene, camera, renderer, {
            name: 'Interactive Gallery',
            autoRotate: false,
            animationSpeed: 0.5,
            responsive: true
        });
        
        // Store reference to all projects
        this.projectsMap = projectsMap;
        
        // Project-specific properties
        this.cubes = [];
        this.hoveredObject = null;
        this.originalColors = new Map();
        this.projectMapping = new Map(); // Maps cubes to project names
        
        // Project configurations
        this.projectConfigs = [
            {
                name: 'particle-system',
                title: 'Particle System',
                color: 0xff6b6b,
                description: 'Dynamic particle animation'
            },
            {
                name: 'diss-project',
                title: 'LSTM Neural Network',
                color: 0x4ecdc4,
                description: 'Sign Language Translator'
            },
            {
                name: 'compiler-project',
                title: 'Compiler Project',
                color: 0x45b7d1,
                description: 'Recursive Descent Compiler'
            },
            {
                name: 'comp-physics-project',
                title: 'Particle Decay',
                color: 0xf9ca24,
                description: 'Three-body decay simulation'
            },
            {
                name: 'threejs-game-project',
                title: 'THREE.js Game',
                color: 0xf0932b,
                description: 'Interactive Graphics Project'
            }
        ];
    }
    
    create() {
        this.GalleryGroup = new THREE.Group();
        const spacing = 3;
        const count = this.projectConfigs.length;
        const start = - ((count-1) * spacing) / 2;
        // Create a gallery of interactive cubes representing projects
        this.projectConfigs.forEach((config, i) => {
            // Create geometry and material
            const geometry = this.createGeometry('box', 1.5, 1.5, 1.5);
            const material = this.createMaterial('standard', {
                color: config.color,
                metalness: 0.3,
                roughness: 0.4
            });
            
            // Create mesh
            const cube = new THREE.Mesh(geometry, material);
            cube.position.x = start + i * spacing; // Spread them out more
            cube.position.y = 0;
            cube.position.z = 0;
            
            // Store original color and project mapping
            this.originalColors.set(cube, config.color);
            this.projectMapping.set(cube, config.name);
            
            // Create text label for the cube
            this.createLabel(cube, config);
            
            // Add to scene
            this.GalleryGroup.add(cube);
            this.makeInteractive(cube);
            this.cubes.push(cube);
        });
        
        // Add a title
        this.createTitle();
        this.addObject(this.GalleryGroup);
        console.log(`${this.config.name}: Created ${this.cubes.length} project cubes`);
        this.GalleryGroup.position.set(0,0,0);
    }
    
    createLabel(cube, config) {
        // Create a sprite to display project name
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 256;
        canvas.height = 128;
        
        // Style the text
        context.fillStyle = 'rgba(255, 255, 255, 0.9)';
        context.font = 'Bold 24px Arial';
        context.textAlign = 'center';
        context.fillText(config.title, 128, 40);
        
        context.font = '16px Arial';
        context.fillStyle = 'rgba(255, 255, 255, 0.7)';
        context.fillText(config.description, 128, 70);
        
        // Create texture from canvas
        const texture = new THREE.CanvasTexture(canvas);
        const spriteMaterial = new THREE.SpriteMaterial({ 
            map: texture,
            transparent: true
        });
        
        const sprite = new THREE.Sprite(spriteMaterial);
        sprite.position.y = -1.5;
        sprite.scale.set(2, 1, 1);
        
        cube.add(sprite);
    }
    
    createTitle() {
        // Create title text
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 512;
        canvas.height = 128;
        
        context.fillStyle = 'rgba(255, 255, 255, 0.9)';
        context.font = 'Bold 48px Arial';
        context.textAlign = 'center';
        context.fillText('Select a Project', 256, 70);
        
        const texture = new THREE.CanvasTexture(canvas);
        const spriteMaterial = new THREE.SpriteMaterial({ 
            map: texture,
            transparent: true
        });
        
        const sprite = new THREE.Sprite(spriteMaterial);
        sprite.position.y = 3;
        sprite.scale.set(4, 1, 1);
        
        this.addObject(sprite);
    }
    
    animate(deltaTime, elapsedTime) {
        super.animate(deltaTime, elapsedTime);
        
        // Animate cubes
        this.cubes.forEach((cube, index) => {
            // Floating animation
            cube.position.y = Math.sin(elapsedTime * 0.5 + index) * 0.2;
            
            // Gentle rotation
            if (cube !== this.hoveredObject) {
                cube.rotation.y += deltaTime * 0.2;
            }
        });
        
        // Hover effect
        if (this.hoveredObject) {
            this.hoveredObject.rotation.y += deltaTime * 0.5;
            const scale = 1.2 + Math.sin(elapsedTime * 3) * 0.05;
            this.hoveredObject.scale.setScalar(scale);
        }
    }
    
    onMouseIntersect(intersects) {
        // Remove previous hover effect
        if (this.hoveredObject && (!intersects.length || intersects[0].object !== this.hoveredObject)) {
            this.hoveredObject.scale.setScalar(1);
            const originalColor = this.originalColors.get(this.hoveredObject);
            this.hoveredObject.material.color.setHex(originalColor);
            this.hoveredObject.material.emissive = new THREE.Color(0x000000);
            this.hoveredObject = null;
            document.body.style.cursor = 'default';
        }
        
        // Apply hover effect to new object
        if (intersects.length > 0) {
            const object = intersects[0].object;
            if (this.cubes.includes(object) && object !== this.hoveredObject) {
                this.hoveredObject = object;
                object.material.emissive = new THREE.Color(0x444444);
                document.body.style.cursor = 'pointer';
            }
        }
    }
    
    onObjectClick(intersection) {
        const clickedCube = intersection.object;
        const projectName = this.projectMapping.get(clickedCube);
        
        if (projectName) {
            console.log(`Launching project: ${projectName}`);
            
            // Check if project exists
            const project = this.projectsMap.get(projectName);
            if (project) {
                // Hide the navigator
                this.hide();
                
                // Show the selected project
                project.show();
                
                // Update current project reference (you'll need to pass a callback)
                if (this.onProjectSelect) {
                    this.onProjectSelect(projectName, project);
                }
            } else {
                console.log(`Project ${projectName} not found. Creating placeholder...`);
                // You could show a "coming soon" message or create the project on demand
                this.showComingSoon(clickedCube);
            }
        }
    }
    
    showComingSoon(cube) {
        // Animate the cube to indicate it's not ready
        const originalColor = this.originalColors.get(cube);
        
        // Flash red
        cube.material.color.setHex(0xff0000);
        setTimeout(() => {
            cube.material.color.setHex(originalColor);
        }, 200);
        
        // Shake animation
        const originalX = cube.position.x;
        let shakeCount = 0;
        const shake = () => {
            if (shakeCount < 6) {
                cube.position.x = originalX + (Math.random() - 0.5) * 0.2;
                shakeCount++;
                setTimeout(shake, 50);
            } else {
                cube.position.x = originalX;
            }
        };
        shake();
    }
    
    onShow() {
        console.log(`${this.config.name} is now active`);
        
        // Animate cubes in with stagger
        this.cubes.forEach((cube, index) => {
            cube.scale.setScalar(0);
            cube.rotation.set(0, 0, 0);
            
            setTimeout(() => {
                const animateIn = () => {
                    const currentScale = cube.scale.x;
                    const newScale = currentScale + (1 - currentScale) * 0.1;
                    cube.scale.setScalar(newScale);
                    
                    if (Math.abs(newScale - 1) > 0.01) {
                        requestAnimationFrame(animateIn);
                    }
                };
                animateIn();
            }, index * 100);
        });
    }
}

//export default InteractiveGallery;


class DissProject extends Project {
    constructor(scene, camera, renderer) {
        super(scene, camera, renderer, {
            name: 'Rotating Logo',
            autoRotate: true,
            animationSpeed: 0.5,
            responsive: true
        });
        
        this.logo = null;
    }
    
    create() {
        // Create a group to hold all parts
        const logoGroup = new THREE.Group();
        
        // Create a torus knot as an example logo
        const geometry = new THREE.TorusKnotGeometry(2, 0.5, 100, 16);
        const material = this.createMaterial('standard', {
            color: 0x00ff88,
            metalness: 0.4,
            roughness: 0.2,
            emissive: 0x004422,
            emissiveIntensity: 0.2
        });
        
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        logoGroup.add(ambientLight);

        this.logo = new THREE.Mesh(geometry, material);
        logoGroup.add(this.logo);
        
        // Add some orbiting spheres
        for (let i = 0; i < 5; i++) {
            const sphereGeometry = new THREE.SphereGeometry(0.2, 32, 32);
            const sphereMaterial = this.createMaterial('standard', {
                color: new THREE.Color().setHSL(i / 5, 1, 0.5),
                metalness: 0.8,
                roughness: 0.2
            });
            
            const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
            const angle = (i / 5) * Math.PI * 2;
            sphere.position.x = Math.cos(angle) * 3;
            sphere.position.z = Math.sin(angle) * 3;
            
            logoGroup.add(sphere);
        }
        
        this.addObject(logoGroup);
        this.logoGroup = logoGroup;
    }
    
    animate(deltaTime, elapsedTime) {
        super.animate(deltaTime, elapsedTime);
        
        if (this.logo) {
            // Rotate the main logo
            this.logo.rotation.x += deltaTime * 0.3;
            this.logo.rotation.y += deltaTime * 0.5;
            
            // Rotate the entire group
            this.logoGroup.rotation.y += deltaTime * 0.2;
            
            // Animate the spheres up and down
            this.logoGroup.children.forEach((child, index) => {
                if (child !== this.logo) {
                    child.position.y = Math.sin(elapsedTime * 2 + index) * 0.5;
                }
            });
        }
    }
}

export {DissProject};

// Another example project
class ParticleSystem extends Project {
    constructor(scene, camera, renderer) {
        super(scene, camera, renderer, {
            name: 'Particle System',
            autoRotate: true,
            animationSpeed: 0.1
        });
        
        this.particleSystem = null;
    }
    
    create() {
        // Create a particle system
        const particleCount = 1000;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        
        for (let i = 0; i < particleCount * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * 10;     // x
            positions[i + 1] = (Math.random() - 0.5) * 10; // y
            positions[i + 2] = (Math.random() - 0.5) * 10; // z
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const material = this.createMaterial('basic', {
            color: 0x00ff88,
            size: 0.1
        });
        
        this.particleSystem = new THREE.Points(geometry, material);
        this.addObject(this.particleSystem);
    }
    
    animate(deltaTime, elapsedTime) {
        super.animate(deltaTime, elapsedTime);
        
        if (this.particleSystem) {
            // Animate particles
            const positions = this.particleSystem.geometry.attributes.position.array;
            
            for (let i = 0; i < positions.length; i += 3) {
                positions[i + 1] += Math.sin(elapsedTime + positions[i]) * 0.01;
            }
            
            this.particleSystem.geometry.attributes.position.needsUpdate = true;
        }
    }
}

class CompPhysics extends Project {
    constructor(scene, camera, renderer) {
        super(scene, camera, renderer, {
            name: 'Computational Physics',
            autoRotate: false,
            animationSpeed: 0.5,
            responsive: true
        });
        
        this.currentView = 0;
        this.panels = [];
        this.mainGroup = null;
        this.navigationButtons = null;
        this.folder = './src/projects/Physics/';
        this.imgLoader = new THREE.ImageLoader();
        // Project content data
        this.projectSections = [
            {
                title: 'Three Body Decay Simulation',
                subtitle: 'Dalitz Plot Analysis of Particle Physics',
                content: {
                    description: {text:'A computational study of three-body particle decays using Dalitz plot representations. This project was undertaken during my second year of university for the computational physics module. It simulates the decay of a parent particle into three daughter particles, analyzing the kinematic distributions and interference patterns that arise from quantum mechanical effects.',
                        imgPath : `${this.folder}Dalitz.png`
                    },
                    explanation: [
                        'The Dalitz plot is a two-dimensional representation of three-body decay kinematics, where each point corresponds to a specific energy configuration of the daughter particles.',
                        'By plotting invariant masses of particle pairs, we can visualize the phase space distribution and identify resonance structures.',
                        'Monte Carlo simulations generate large datasets of decay events, allowing statistical analysis of the underlying physics processes.',
                        'Interference effects between different decay pathways create characteristic patterns in the Dalitz plot density distribution.'
                    ],
                    explanationImgPath: `${this.folder}Q2.png`,
                    objectives: [
                        'Simulate realistic three-body decay kinematics',
                        'Generate and visualize Dalitz plot distributions',
                        'Analyze interference patterns with varying parameters',
                        'Implement maximum likelihood fitting procedures'
                    ]
                }
            },
            {
                title: 'Interference Pattern Analysis',
                content: {text: 'The Dalitz plots show two cases of interference patterns for theta values, constructive and destructive.'},
                leftContent: {
                    title: 'Theta Parameter Variation',
                    text: 'Investigation of how the interference angle θ affects the resulting Dalitz plot distribution. Different theta values modify the relative phases between decay amplitudes, creating distinct interference patterns in the kinematic phase space.'
                },
                rightContent: {
                    title: 'Pattern Recognition',
                    text: 'Development of algorithms to identify and quantify interference structures in the simulated data. Statistical measures help characterize the strength and nature of quantum interference effects.'
                },
                imgPaths: [`${this.folder}Q3Cons.png`, `${this.folder}Q3Destr.png`]
            },
            {
                title: 'Maximum Likelihood Fitting',
                content: {text: 'The fitting procedure involves optimizing model parameters to best match the observed Dalitz plot distributions using maximum likelihood estimation.'},
                leftContent: {
                    title: 'Log-Likelihood Optimization',
                    text: 'Implementation of maximum likelihood estimation to extract physics parameters from simulated Dalitz distributions. The fitting procedure optimizes model parameters to best describe the observed data patterns.'
                },
                rightContent: {
                    title: 'Parameter Recovery',
                    text: 'Validation of the fitting procedure by attempting to recover known input parameters from synthetic datasets. This tests the reliability and accuracy of the analysis methods.'
                }
                ,imgPaths: [`${this.folder}Q4a.png`, `${this.folder}Q4b.png`],
            },
            {
                title: 'Results & Validation',
                content: {
                    achievements: [
                        'Successfully simulated three-body decay kinematics',
                        'Generated realistic Dalitz plot distributions',
                        'Observed clear interference patterns for different θ values',
                        'Implemented robust maximum likelihood fitting',
                        'Achieved parameter recovery within statistical uncertainties',
                        'Validated Monte Carlo simulation accuracy'
                    ],
                    applications: [
                        'Particle physics experiment analysis',
                        'Resonance structure identification',
                        'Quantum interference studies',
                        'Statistical analysis method development',
                        'Computational physics education',
                        'Monte Carlo simulation techniques'
                    ]
                }
            }
        ];
    }
    
    create() {
        this.mainGroup = new THREE.Group();
        
        // Create all panels
        this.createOverviewPanel();
        this.createAnalysisPanels();
        this.createResultsPanel();
        
        // Create navigation
        this.createNavigationButtons();
        
        this.addObject(this.mainGroup);
        
        // Show initial view
        this.showView(0);
    }
    
    createOverviewPanel() {
        const group = new THREE.Group();
        
        // Title
        const titleCanvas = this.createTextCanvas(
            this.projectSections[0].title,
            900, 80,
            { fontSize: 38, color: '#dc2626', bgColor: 'transparent' }
        );
        const titleMesh = new THREE.Mesh(
            new THREE.PlaneGeometry(9, 0.8),
            new THREE.MeshBasicMaterial({ map: titleCanvas, transparent: true })
        );
        titleMesh.position.y = 4.4;
        group.add(titleMesh);
        
        // Subtitle
        const subtitleCanvas = this.createTextCanvas(
            this.projectSections[0].subtitle,
            700, 50,
            { fontSize: 24, color: '#7c2d12', bgColor: 'transparent' }
        );
        const subtitleMesh = new THREE.Mesh(
            new THREE.PlaneGeometry(7, 0.5),
            new THREE.MeshBasicMaterial({ map: subtitleCanvas, transparent: true })
        );
        subtitleMesh.position.y = 3.9;
        group.add(subtitleMesh);
        
        // Description
        const wrappedCanv = this.wrapText(this.projectSections[0].content.description.text, 80);
        const descCanvas = this.createMultiLineTextCanvas(
            wrappedCanv,
            850, 160,
            { fontSize: 20, color: '#374151', bgColor: 'transparent'}
        );
        const descMesh = new THREE.Mesh(
            new THREE.PlaneGeometry(8.5, 1.6),
            new THREE.MeshBasicMaterial({ map: descCanvas, transparent: true })
        );
        descMesh.position.y = 3;
        descMesh.position.x = 0.6;
        group.add(descMesh);

        //LHS Imahe
        const loader = new THREE.ImageLoader();
        loader.load(this.projectSections[0].content.description.imgPath, (image) => {
            const texture = new THREE.Texture(image);
            texture.needsUpdate = true;
            const aspect = image.width / image.height;
            const height = 5.8;
            const width = height*aspect;

            const imgMesh = new THREE.Mesh(
                new THREE.PlaneGeometry(width,height),
                this.createContrastMaterial(texture, 1.1, 0.02)
            );

            imgMesh.position.set(-7.2, 0.6, 0.01);
            group.add(imgMesh);
        });
        // RHS Image
        loader.load(this.projectSections[0].content.explanationImgPath, (image) => {
            const texture = new THREE.Texture(image);
        
            texture.needsUpdate = true;
            const aspect = image.width / image.height;
            const height = 5.8;
            const width = height*aspect;
            const imgMesh = new THREE.Mesh(
                new THREE.PlaneGeometry(width,height),
                this.createContrastMaterial(texture, 1.1, 0.02)
            );

            imgMesh.position.set(7.4, 0.6, 0.01);
            group.add(imgMesh);
        });

        // Explanation paragraphs
        this.projectSections[0].content.explanation.forEach((paragraph, i) => {
            const paraCanvas = this.createMultiLineTextCanvas(
                this.wrapText(paragraph, 70),
                800, 60,
                { fontSize: 20, color: '#4b5563', bgColor: 'transparent', align: 'center' }
            );
            const paraMesh = new THREE.Mesh(
                new THREE.PlaneGeometry(8, 0.6),
                new THREE.MeshBasicMaterial({ map: paraCanvas, transparent: true })
            );
            paraMesh.position.set(0.8, 2 - i * 0.65, 0.01);
            group.add(paraMesh);
        });
        
        // Objectives
        const objTitleCanvas = this.createTextCanvas(
            'Project Objectives',
            400, 40,
            { fontSize: 24, color: '#dc2626', bgColor: 'transparent' }
        );
        const objTitleMesh = new THREE.Mesh(
            new THREE.PlaneGeometry(4, 0.4),
            new THREE.MeshBasicMaterial({ map: objTitleCanvas, transparent: true })
        );
        objTitleMesh.position.y = -1.2;
        group.add(objTitleMesh);
        
        this.projectSections[0].content.objectives.forEach((objective, i) => {
            const objCanvas = this.createTextCanvas(
                `• ${objective}`,
                650, 35,
                { fontSize: 20, color: '#7f1d1d', bgColor: 'transparent', align: 'left' }
            );
            const objMesh = new THREE.Mesh(
                new THREE.PlaneGeometry(6.5, 0.35),
                new THREE.MeshBasicMaterial({ map: objCanvas, transparent: true })
            );
            objMesh.position.set(0.8, -1.5 - i * 0.4, 0.01);
            group.add(objMesh);
        });
        
        group.visible = true;
        this.panels.push(group);
        this.mainGroup.add(group);
    }
    
    createAnalysisPanels() {
        // Create panels for sections 1 and 2 (Interference and Fitting)
        [1, 2].forEach(sectionIndex => {
            const section = this.projectSections[sectionIndex];
            const group = new THREE.Group();
            
            // Section title
            const titleCanvas = this.createTextCanvas(
                section.title,
                700, 60,
                { fontSize: 32, color: '#dc2626', bgColor: 'transparent' }
            );
            const titleMesh = new THREE.Mesh(
                new THREE.PlaneGeometry(7, 0.6),
                new THREE.MeshBasicMaterial({ map: titleCanvas, transparent: true })
            );
            titleMesh.position.y = 4.5;
            group.add(titleMesh);
            
            // Images
            // LHS 
            let LCoords, RCoords, height, panelCoords, panelWidth;
            if (sectionIndex === 1){

                height = 5.8;
                LCoords = [-6.8,0.3, 0.01];
                RCoords = [6.8,0.3,0.01];
                panelCoords = [0,0.25,0.1];
                panelWidth = 8;

            } else {
                height = 3.8;
                LCoords = [-2.45,2, 0.01];
                RCoords = [-3,-2,0.01];
                panelCoords = [4.5,1.962,0.1];
            }
            this.imgLoader.load(section.imgPaths[0], (image) => {
                const texture = new THREE.Texture(image);
                texture.needsUpdate = true;
                const aspect = image.width / image.height;
                const width = height*aspect;
                const imgMesh = new THREE.Mesh(
                    new THREE.PlaneGeometry(width,height),
                    this.createContrastMaterial(texture, 1.1, 0.02)
                );

            imgMesh.position.set(LCoords[0], LCoords[1], LCoords[2]);
            
            group.add(imgMesh);
            });
            // RHS
            let RHSImgAspect;
            this.imgLoader.load(section.imgPaths[1], (image) => {
                const texture = new THREE.Texture(image);
                texture.needsUpdate = true;
                const RHSImageAspect = image.width / image.height;
                const width = height*RHSImageAspect;
                const imgMesh = new THREE.Mesh(
                    new THREE.PlaneGeometry(width,height),
                    this.createContrastMaterial(texture, 1.1, 0.02)
                );
                imgMesh.position.set(RCoords[0], RCoords[1], RCoords[2]);
                group.add(imgMesh);
            });
            // Middle column
            let mainPanel;
            if(sectionIndex === 1){
                const upperMiddlePanel = this.createMultiLineTextCanvas(
                this.wrapText('One of the components for this project was the generation of two resonances in different particle systems which interfere with each other. This required three different Dalitz plots for three different values of θ to visualise different types of interference. To do this a function to generate events according to interfering Breit-Wigner resonances was implemented.', 100),
                    1000, 120,
                    { fontSize: 18, color: '#4b5563', bgColor: 'transparent', align: 'center' }
                );
                const upperMiddleMesh = new THREE.Mesh(
                    new THREE.PlaneGeometry(10, 1.2),
                    new THREE.MeshBasicMaterial({ map: upperMiddlePanel, transparent: true })
                );
                upperMiddleMesh.position.y = 3.7;
                upperMiddleMesh.position.x = 1;
                group.add(upperMiddleMesh);

                mainPanel = this.createContentPanel(
                section.leftContent.title,
                section.content.text,
                '#fef2f2',
                '#991b1b'
            );
            } else {
                //const mPanelArgs = [4,3.7, 5,0.5, 3.5, ]
                mainPanel = this.createContentPanel(
                section.leftContent.title,
                section.content.text,
                '#fef2f2',
                '#991b1b',
                {custom: true,
                    bgWidth: panelWidth || 4,
                    bgHeight: 3.7, titleWidth: 5,
                    titleHeight: 0.5, contentWidth: panelWidth ? panelWidth-0.5 : 5.5, 
                    contentHeight: 2.5, wrapLength: 45}
                );

                const secondPanelWidth = 6;
                const secondPanelHeight = secondPanelWidth / RHSImgAspect;
                const secondPanel = this.createContentPanel(
                    section.rightContent.title,
                    section.rightContent.text,
                    '#fef2f2',
                    '#991b1b',
                    {custom: true,
                        bgWidth: secondPanelWidth || 4,
                        bgHeight: secondPanelHeight || 3.7, titleWidth: 5,
                        titleHeight: 0.5, contentWidth: secondPanelWidth ? secondPanelWidth+1.5 : 5.5, 
                        contentHeight: secondPanelHeight-0.5, wrapLength: 70}
                    );
                    //should be -0.5 but main panel defaulted to 5.5 and then used other ways to align properly so follow convention for ease
                    secondPanel.position.set(5.9,-2,0.01);
                    group.add(secondPanel);

            }
            mainPanel.position.set(panelCoords[0], panelCoords[1], panelCoords[2]);
            group.add(mainPanel);
            
            group.visible = false;
            this.panels.push(group);
            this.mainGroup.add(group);
        });
    }
    
    /**
     * 
     * @param {*} title 
     * @param {*} content 
     * @param {*} bgColor 
     * @param {*} titleColor 
     * @param {*} options:
        * custom: boolean - if false, uses default sizes and layout
        * bgWidth, bgHeight: numbers - background panel dimensions
        * titleWidth, titleHeight: numbers - title dimensions
        * contentWidth, contentHeight: numbers - content dimensions
        * wrapLength: number - max characters per line for content text
        * titleWrapLength: number - max characters per line for title text
        * 
     * @returns 
     */
    createContentPanel(title, content, bgColor, titleColor, options={}) {
        const group = new THREE.Group();
        
        // needs clean up -- move default values into default if no options
        if(!options.custom){
            // Background panel
            const bgGeometry = new THREE.PlaneGeometry(6, 4.5);
            const bgMaterial = new THREE.MeshBasicMaterial({
                color: new THREE.Color(bgColor),
                transparent: true,
                opacity: 0.9
            });
            const bgMesh = new THREE.Mesh(bgGeometry, bgMaterial);
            group.add(bgMesh);
            
            // Border
            const borderGeometry = new THREE.PlaneGeometry(6.1, 4.6);
            const borderMaterial = new THREE.MeshBasicMaterial({
                color: 0xfca5a5,
                transparent: true,
                opacity: 0.5
            });
            const borderMesh = new THREE.Mesh(borderGeometry, borderMaterial);
            borderMesh.position.z = -0.01;
            group.add(borderMesh);
            
            // Panel title
            const titleCanvas = this.createTextCanvas(
                title,
                500, 50,
                { fontSize: 22, color: titleColor, bgColor: 'transparent' }
            );
            const titleMesh = new THREE.Mesh(
                new THREE.PlaneGeometry(5, 0.5),
                new THREE.MeshBasicMaterial({ map: titleCanvas, transparent: true })
            );
            titleMesh.position.y = 1.8;
            titleMesh.position.z = 0.02;
            group.add(titleMesh);
            
            // Panel content - handle text wrapping
            const wrappedText = this.wrapText(content, 45);
            const contentCanvas = this.createMultiLineTextCanvas(
                wrappedText,
                500, 250,
                { fontSize: 15, color: '#374151', bgColor: 'transparent' }
            );
            const contentMesh = new THREE.Mesh(
                new THREE.PlaneGeometry(5.5, 3),
                new THREE.MeshBasicMaterial({ map: contentCanvas, transparent: true })
            );
            contentMesh.position.y = -0.2;
            contentMesh.position.z = 0.02;
            group.add(contentMesh);
        } else {
            // Background panel
            const bgGeometry = new THREE.PlaneGeometry(options.bgWidth || 6, options.bgHeight || 4.5);
            const bgMaterial = new THREE.MeshBasicMaterial({
                color: bgColor,
                transparent: true,
                opacity: 0.9
            });
            const bgMesh = new THREE.Mesh(bgGeometry, bgMaterial);
            group.add(bgMesh);
            // Border
            const borderGeometry = new THREE.PlaneGeometry((options.bgWidth || 6)+0.1, (options.bgHeight || 4.5)+0.1);
            const borderMaterial = new THREE.MeshBasicMaterial({
                color: 0xfca5a5,
                transparent: true,
                opacity: 0.5
            });
            const borderMesh = new THREE.Mesh(borderGeometry, borderMaterial);
            borderMesh.position.z = -0.01;
            group.add(borderMesh);

            // Panel title
            const titleCanvas = this.createTextCanvas(
                title,
                500, 50,
                { fontSize: 22, color: titleColor, bgColor: 'transparent' }
            );
            const titleMesh = new THREE.Mesh(
                new THREE.PlaneGeometry(options.titleWidth || 5, options.titleHeight || 0.5),
                new THREE.MeshBasicMaterial({ map: titleCanvas, transparent: true })
            );
            titleMesh.position.y = (options.bgHeight || 4.5)/2 - (options.titleHeight || 0.5)/2 - 0.1;
            titleMesh.position.z = 0.02;
            group.add(titleMesh);
            // Panel content - handle text wrapping
            
            const contentCanvLength = options.contentWidth ? options.contentWidth*104 : 500;

            const wrappedText = this.wrapText(content, options.wrapLength || 45);
            const contentCanvas = this.createMultiLineTextCanvas(
                wrappedText,
                contentCanvLength, contentCanvLength/2,
                { fontSize: 20, color: '#374151', bgColor: 'transparent' }
            );
            const contentMesh = new THREE.Mesh(
                new THREE.PlaneGeometry(options.contentWidth || 5.5, options.contentHeight || 3),
                new THREE.MeshBasicMaterial({ map: contentCanvas, transparent: true })
            );
            contentMesh.position.x = 0.6;
            contentMesh.position.y = titleMesh.position.y - (options.titleHeight || 0.5)/2 - (options.contentHeight || 3)/2 - 0.1;
            contentMesh.position.z = 0.02;
            group.add(contentMesh);
        }

        return group;
    }
    
    createResultsPanel() {
        const section = this.projectSections[3];
        const group = new THREE.Group();
        
        // Section title
        const titleCanvas = this.createTextCanvas(
            section.title,
            600, 60,
            { fontSize: 32, color: '#dc2626', bgColor: 'transparent' }
        );
        const titleMesh = new THREE.Mesh(
            new THREE.PlaneGeometry(6, 0.6),
            new THREE.MeshBasicMaterial({ map: titleCanvas, transparent: true })
        );
        titleMesh.position.y = 3;
        group.add(titleMesh);
        
        // Achievements section
        const achieveTitle = this.createTextCanvas(
            'Key Achievements',
            400, 40,
            { fontSize: 20, color: '#059669', bgColor: 'transparent' }
        );
        const achieveTitleMesh = new THREE.Mesh(
            new THREE.PlaneGeometry(4, 0.4),
            new THREE.MeshBasicMaterial({ map: achieveTitle, transparent: true })
        );
        achieveTitleMesh.position.set(-3, 2);
        group.add(achieveTitleMesh);
        
        // Achievements list
        section.content.achievements.forEach((achievement, i) => {
            const achieveCanvas = this.createTextCanvas(
                `✓ ${achievement}`,
                500, 32,
                { fontSize: 14, color: '#065f46', bgColor: 'transparent', align: 'left' }
            );
            const achieveMesh = new THREE.Mesh(
                new THREE.PlaneGeometry(5, 0.32),
                new THREE.MeshBasicMaterial({ map: achieveCanvas, transparent: true })
            );
            achieveMesh.position.set(-3, 1.6 - i * 0.35, 0.01);
            group.add(achieveMesh);
        });
        
        // Applications section
        const appTitle = this.createTextCanvas(
            'Applications',
            400, 40,
            { fontSize: 20, color: '#7c3aed', bgColor: 'transparent' }
        );
        const appTitleMesh = new THREE.Mesh(
            new THREE.PlaneGeometry(4, 0.4),
            new THREE.MeshBasicMaterial({ map: appTitle, transparent: true })
        );
        appTitleMesh.position.set(3, 2.2, 0.01);
        group.add(appTitleMesh);
        
        // Applications list
        section.content.applications.forEach((app, i) => {
            const appCanvas = this.createTextCanvas(
                `→ ${app}`,
                500, 32,
                { fontSize: 14, color: '#5b21b6', bgColor: 'transparent', align: 'left' }
            );
            const appMesh = new THREE.Mesh(
                new THREE.PlaneGeometry(5, 0.32),
                new THREE.MeshBasicMaterial({ map: appCanvas, transparent: true })
            );
            appMesh.position.set(3, 1.8 - i * 0.35, 0.01);
            group.add(appMesh);
        });
        
        group.visible = false;
        this.panels.push(group);
        this.mainGroup.add(group);
    }
    
    createNavigationButtons() {
        const buttonGroup = new THREE.Group();
        buttonGroup.position.y = -3.8;
        buttonGroup.position.z = 1;
        
        const buttonLabels = ['Overview', 'Interference', 'ML Fitting', 'Results'];
        
        buttonLabels.forEach((label, i) => {
            const geometry = new THREE.BoxGeometry(2.6, 0.6, 0.2);
            const material = new THREE.MeshStandardMaterial({
                color: i === 0 ? 0xdc2626 : 0x6b7280,
                emissive: i === 0 ? 0x991b1b : 0x000000,
                emissiveIntensity: 0.2
            });
            
            const button = new THREE.Mesh(geometry, material);
            button.position.x = (i - 1.5) * 3;
            button.userData = { viewIndex: i, isButton: true };
            
            // Button text
            const textCanvas = this.createTextCanvas(label, 260, 60, { 
                fontSize: 15, 
                color: i === 0 ? '#ffffff' : '#e5e7eb' 
            });
            const textMesh = new THREE.Mesh(
                new THREE.PlaneGeometry(2.4, 0.5),
                new THREE.MeshBasicMaterial({ map: textCanvas, transparent: true })
            );
            textMesh.position.z = 0.11;
            button.add(textMesh);
            
            this.makeInteractive(button);
            buttonGroup.add(button);
        });
        
        this.navigationButtons = buttonGroup;
        this.mainGroup.add(buttonGroup);
    }
    
    createTextCanvas(text, width, height, options = {}) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        const scale = window.devicePixelRatio || 1;
        canvas.width = width * scale;
        canvas.height = height * scale;

        ctx.scale(scale, scale);
        ctx.imageSmoothingEnabled = true;
            
        if (options.bgColor && options.bgColor !== 'transparent') {
            ctx.fillStyle = options.bgColor;
            ctx.fillRect(0, 0, width, height);
        }
        
        ctx.fillStyle = options.color || '#ffffff';
        ctx.font = `${options.fontSize || 20}px Arial`;
        ctx.textAlign = options.align || 'center';
        ctx.textBaseline = 'middle';
        
        if (options.wrap && options.align === 'left') {
            // Handle wrapped text for left alignment
            const lines = this.wrapText(text, 50);
            const lineHeight = options.fontSize * 1.2;
            const startY = (height - (lines.length * lineHeight)) / 2 + lineHeight / 2;
            
            lines.forEach((line, i) => {
                ctx.fillText(line, 20, startY + i * lineHeight);
            });
        } else {
            const x = options.align === 'left' ? 20 : width / 2;
            ctx.fillText(text, x, height / 2);
        }
            
        const tex = new THREE.CanvasTexture(canvas);
        tex.minFilter = THREE.LinearFilter;
        tex.magFilter = THREE.LinearFilter;
        tex.anisotropy = this.renderer.capabilities.getMaxAnisotropy();
        tex.needsUpdate = true;

        return tex;
    }
    

    createMultiLineTextCanvas(lines, width, height, options = {}) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        const scale = window.devicePixelRatio || 1;
        canvas.width = width * scale;
        canvas.height = height * scale;

        ctx.scale(scale, scale);
        ctx.imageSmoothingEnabled = true;
            
        if (options.bgColor && options.bgColor !== 'transparent') {
            ctx.fillStyle = options.bgColor;
            ctx.fillRect(0, 0, width, height);
        }
        
        ctx.fillStyle = options.color || '#ffffff';
        ctx.font = `${options.fontSize || 18}px Arial`;
        ctx.textAlign = 'left';
        
        const lineHeight = options.fontSize * 1.3;
        const startY = options.fontSize + 10;
        
        lines.forEach((line, i) => {
            ctx.fillText(line, 20, startY + i * lineHeight);
        });
            
        const tex = new THREE.CanvasTexture(canvas);
        tex.minFilter = THREE.LinearFilter;
        tex.magFilter = THREE.LinearFilter;
        tex.anisotropy = this.renderer.capabilities.getMaxAnisotropy();
        tex.needsUpdate = true;

        return tex;
    }
    
    wrapText(text, maxCharsPerLine) {
        const words = text.split(' ');
        const lines = [];
        let currentLine = '';
        
        words.forEach(word => {
            if ((currentLine + word).length <= maxCharsPerLine) {
                currentLine += (currentLine ? ' ' : '') + word;
            } else {
                if (currentLine) lines.push(currentLine);
                currentLine = word;
            }
        });
        
        if (currentLine) lines.push(currentLine);
        return lines;
    }
    
    showView(index) {
        // Show the correct panel
        this.panels.forEach((panel, i) => {
            panel.visible = (i === index);
        });

        // Update button states
        if (this.navigationButtons) {
            this.navigationButtons.children.forEach((button, i) => {
                const isActive = i === index;

                button.material.color.setHex(isActive ? 0xdc2626 : 0x6b7280);
                button.material.emissive = new THREE.Color(isActive ? 0x991b1b : 0x000000);
                button.material.emissiveIntensity = isActive ? 0.2 : 0.0;
                
                const textMesh = button.children[0];
                if (textMesh) {
                    const buttonLabels = ['Overview', 'Interference', 'ML Fitting', 'Results'];
                    const textCanvas = this.createTextCanvas(
                        buttonLabels[i], 
                        260, 60, 
                        { 
                            fontSize: 15, 
                            color: isActive ? '#ffffff' : '#e5e7eb' 
                        }
                    );
                    textMesh.material.map = textCanvas;
                    textMesh.material.needsUpdate = true;
                }
            });
        }

        this.currentView = index;
    }
    
    onObjectClick(intersection) {
        const object = intersection.object;
        if (object.userData && object.userData.isButton) {
            this.showView(object.userData.viewIndex);
        }
    }
    
    onMouseIntersect(intersects) {
        // Reset all buttons
        if (this.navigationButtons) {
            this.navigationButtons.children.forEach(button => {
                button.userData.isHovered = false;
            });
        }
        
        // Check for button hover
        if (intersects.length > 0) {
            const object = intersects[0].object;
            if (object.userData && object.userData.isButton) {
                object.userData.isHovered = true;
                document.body.style.cursor = 'pointer';
            } else {
                document.body.style.cursor = 'default';
            }
        } else {
            document.body.style.cursor = 'default';
        }
    }
    
    animate(deltaTime, elapsedTime) {
        super.animate(deltaTime, elapsedTime);
        
        // Hover effect for buttons
        if (this.navigationButtons) {
            this.navigationButtons.children.forEach(button => {
                if (button.userData.isHovered) {
                    button.scale.setScalar(1.05);
                } else {
                    button.scale.setScalar(1);
                }
            });
        }
    }
    
    onShow() {
        console.log('Computational Physics Project active');
        if (this.mainGroup) {
            this.mainGroup.visible = true;
        }
        this.showView(0);
        
        // Animate in
        if (this.mainGroup) {
            this.mainGroup.scale.setScalar(0);
            const animateIn = () => {
                const scale = this.mainGroup.scale.x;
                const newScale = scale + (1 - scale) * 0.1;
                this.mainGroup.scale.setScalar(newScale);
                
                if (Math.abs(newScale - 1) > 0.01) {
                    requestAnimationFrame(animateIn);
                }
            };
            animateIn();
        }
    }
    
    onHide() {
        if (this.mainGroup) {
            this.mainGroup.visible = false;
        }
        document.body.style.cursor = 'default';
    }
}

class ThreeJSGameProject extends Project {
    constructor(scene, camera, renderer) {
        super(scene, camera, renderer, {
            name: 'THREE.js Game Engine',
            autoRotate: false,
            animationSpeed: 0.5,
            responsive: true
        });
        
        this.currentView = 0;
        this.panels = [];
        this.mainGroup = null;
        this.navigationButtons = null;
        this.folder = `./src/projects/Game/`;
        this.imgLoader = new THREE.ImageLoader();
        this.contentBorderColour = '#c4b5fd';
        this.contentBgColour = '#faf5ff';
        this.fontColour = '#7c3aed';
        this.imgNames = { purple:'PurpleFlower.png',
                                 twoFlower: 'TwoFlowers.png',
                                 worldOne: 'World1NoMoon.png',
                                 worldTwoMoon: 'World2WithMoon.png',
                                 worldTwoNoMoon: 'World2NoMoon.png',
                                 menu: 'Menu.png',
                                 cacti: 'Cacti.png',
                                 trees: 'Trees.png',
                                 rocks: 'Rocks.png',
                                 shadowCasting: 'ObjectShadowCast.png',
                                 character: 'CharacterRay.png',
                                 mainMenu: 'MainMenu.png',
                                 pauseMenu: 'PauseMenu.png'
                             };

        

        // Project content data
        this.projectSections = [
            {
                title: 'THREE.js Game Development',
                subtitle: 'Interactive 3D Game with Custom Engine Features',
                content: {
                    description: 'A comprehensive 3D game built from scratch using THREE.js during my university graphics module. The project demonstrates advanced computer graphics concepts including raycasting for collision detection and shadow rendering, alongside interactive gameplay mechanics across two distinct environments. The game features a complete user interface system with main menu, pause functionality, and end-game screens, as demonstrated in the accompanying images.',
                    explanation: [
                        'The game features two distinct environments as separate levels. Some object assets are shared but lighting and textures are unique to each level.',
                        'Several custom-designed 3D objects were created and integrated into the game world, showcasing 3D modeling skills and asset optimization techniques.',
                        'Advanced raycasting techniques were implemented for both realistic shadow rendering and precise collision detection between game objects.',
                        'A complete user interface system with menus, a GUI for game settings and a breakdown of game controls provides a polished user experience.'
                    ],
                    technologies: [
                        'THREE.js WebGL rendering engine',
                        'Custom raytracing implementation',
                        'Procedural geometry generation',
                        'Real-time lighting and shadow systems',
                        'Physics-based collision detection',
                        'Modular texture and material systems'
                    ],

                imgPath : this.folder + this.imgNames.menu

                }
            },
            {
                title: 'Level Design & Objects',
                leftContent: {
                    title: 'Two-Level Architecture',
                    text: `One of the requirements for this project was designing two distinctly different environments or 'levels'. I chose a forest/meadow theme for the first level and a desert undergoing reclamation for the second. To maintain distinction, each level features unique assets and objectives. The first level's goal is a simple stone collection task, while the second level requires players to 'strip' the leaves off trees, leaving behind bare trunks. Asset placement is randomized, but the number of primary assets can be adjusted through a dropdown menu.`
                },
                rightContent: {
                    title: 'Custom 3D Assets',
                    text: `Aside from the imported character model, texture, and environment map, all custom assets were created using THREE.js (except for the moon, which was made in Blender). Each asset type has its own class with unique properties and player interactions: Stones vary by size, with larger ones appearing 'corrupted' and being unpickable. Trees generate with random edge counts within a preset range and can be chopped or stripped. Flowers spawn in one of three random colors. Bushes reduce the player's movement speed when walked through, while cacti end the game on contact.`
                },
                imgPaths: [
                    this.folder + this.imgNames.worldTwoNoMoon,
                    this.folder + this.imgNames.worldOne
                ]
            },
            {
                title: 'Graphics & Physics Systems',
                leftContent: {
                    title: 'Raycasting Implementation',
                    text: 'This project implemented raycasting for multiple purposes. For realistic shadows, rays are cast from the light source (moon) to determine which objects should be shadowed. Raycasting was also used for collision detection, with multiple rays projected from the player to detect interactions with the environment. This enabled the core gameplay mechanics that require proximity or direct contact with objects. The collision detection system also simulates gravity, allowing the player to jump on or over objects.'
                },
                rightContent: {
                    title: 'Rendering and Scene Management',
                    text: 'Coordinate-based object tracking with hashmaps to register interactions and modifications, for effective resource disposal and selective object destruction. Seamless environment switching between levels with state resets. Dynamic lighting adjustments via fog (in the first level) and a player-tracking spotlight which can be seen in the image below. Dual camera modes were also implemented, allowing the user to switch between a free-view or a third-person follow view. Additionally, a lighweight GUI can be used to directly modify scene size and object count.'
                },
                imgPaths: [
                    this.folder + this.imgNames.worldTwoMoon,
                    this.folder + this.imgNames.trees
                ]
            },
            {
                title: 'Technical Features & Results',
                content: {
                    features: [
                        'Real-time shadow casting with directional lighting',
                        'Coordinate-based object tracking with hashmap implementation',
                        'Interactive menu system with settings',
                        'Visually distinctive level design',
                        'Multi-directional collision detection at different heights for object-specific interactions',
                        'Custom physics system with gravity and velocity based movement',
                        'Real-time camera interpolation with camera viewing modes',
                        'Effective scene management and resource disposal'
                    ],
                    achievements: [
                        'Successfully implemented dual raycaster collision for 3D interactions',
                        'Developed advanced THREE.js proficiency',
                        'Built modular level architecture supporting distinct gameplay mechanics per environment',
                        'Developed a scalable object-oriented asset system',
                        'Optimized performance for web deployment',
                        'Showcased 3D modeling and design skills'
                    ]
                }
            }
        ];

    }
    
    create() {
        this.mainGroup = new THREE.Group();
        
        // Create all panels
        this.createOverviewPanel();
        this.createDevelopmentPanels();
        this.createFeaturesPanel();
        
        // Create navigation
        this.createNavigationButtons();
        
        this.addObject(this.mainGroup);
        
        // Show initial view
        this.showView(0);
    }
    
    createOverviewPanel() {
        const group = new THREE.Group();
        
        // Title
        const titleCanvas = this.createTextCanvas(
            this.projectSections[0].title,
            900, 80,
            { fontSize: 38, color: '#7c3aed', bgColor: 'transparent' }
        );
        const titleMesh = new THREE.Mesh(
            new THREE.PlaneGeometry(9, 0.8),
            new THREE.MeshBasicMaterial({ map: titleCanvas, transparent: true })
        );
        titleMesh.position.y = 3.2;
        group.add(titleMesh);
        
        // Subtitle
        const subtitleCanvas = this.createTextCanvas(
            this.projectSections[0].subtitle,
            800, 50,
            { fontSize: 20, color: '#5b21b6', bgColor: 'transparent' }
        );
        const subtitleMesh = new THREE.Mesh(
            new THREE.PlaneGeometry(8, 0.5),
            new THREE.MeshBasicMaterial({ map: subtitleCanvas, transparent: true })
        );
        subtitleMesh.position.y = 2.6;
        group.add(subtitleMesh);
        
        // Description
        const wrappedDesc = this.wrapText(this.projectSections[0].content.description, 80)
        const descCanvas = this.createMultiLineTextCanvas(
            wrappedDesc,
            850, 160,
            { fontSize: 18, color: '#374151', bgColor: 'transparent', align:'left' }
        );
        const descMesh = new THREE.Mesh(
            new THREE.PlaneGeometry(8.5, 1.6),
            new THREE.MeshBasicMaterial({ map: descCanvas, transparent: true })
        );
        descMesh.position.x = 0.85;
        descMesh.position.y = 1.7;
        descMesh.position.z = 0.1;
        group.add(descMesh);
        
        // Explanation paragraphs
        this.projectSections[0].content.explanation.forEach((paragraph, i) => {
            const paraCanvas = this.createMultiLineTextCanvas(
                this.wrapText(paragraph, 88),
                880, 100,
                { fontSize: 18, color: '#4b5563', bgColor: 'transparent', align: 'left' }
            );
            const paraMesh = new THREE.Mesh(
                new THREE.PlaneGeometry(8.8, 1),
                new THREE.MeshBasicMaterial({ map: paraCanvas, transparent: true })
            );
            paraMesh.position.set(1, 0.4 - i * 0.6, 0.01);
            group.add(paraMesh);
        });


        const imgTitle = this.createTextCanvas(
            'Controls Menu',
            400, 40,
            { fontSize: 18, color: '#7c3aed', bgColor: 'transparent' }
        );
        const imgTitleMesh = new THREE.Mesh(
            new THREE.PlaneGeometry(4, 0.4),
            new THREE.MeshBasicMaterial({ map: imgTitle, transparent: true })
        );
        imgTitleMesh.position.set(-6.8, 2.2, 0.01);
        group.add(imgTitleMesh);



        const imgVals = {
            imgHeights: [4.5, 4.8, 2],
            coords : [[-6.9,0.5,0.001], [6,0.5,0.001],[4,-2.9,0.001]] 
        }
        const imgs = [this.imgNames.menu, this.imgNames.pauseMenu, this.imgNames.mainMenu];
        const heights = imgVals.imgHeights;
        const positions = imgVals.coords;
        imgs.forEach((imgName, i) => {
            this.imgLoader.load(this.folder + imgName, (image) => {
                const texture = new THREE.Texture(image);
                texture.needsUpdate = true;
                const aspect = image.width / image.height;
                const width = heights[i] * aspect;
                const imgMesh = new THREE.Mesh(
                    new THREE.PlaneGeometry(width, heights[i]),
                    this.createContrastMaterial(texture, 1.1, 0.02)
                );
                imgMesh.position.set(...positions[i]);
                group.add(imgMesh);
            });
        });

        
        // Technologies
        const techTitleCanvas = this.createTextCanvas(
            'Core Technologies',
            400, 40,
            { fontSize: 18, color: '#7c3aed', bgColor: 'transparent' }
        );
        const techTitleMesh = new THREE.Mesh(
            new THREE.PlaneGeometry(4, 0.4),
            new THREE.MeshBasicMaterial({ map: techTitleCanvas, transparent: true })
        );
        techTitleMesh.position.y = -1.6;
        group.add(techTitleMesh);
        
        this.projectSections[0].content.technologies.forEach((tech, i) => {
            const techCanvas = this.createTextCanvas(
                `• ${tech}`,
                650, 32,
                { fontSize: 14, color: '#581c87', bgColor: 'transparent', align: 'left' }
            );
            const techMesh = new THREE.Mesh(
                new THREE.PlaneGeometry(6.5, 0.32),
                new THREE.MeshBasicMaterial({ map: techCanvas, transparent: true })
            );
            techMesh.position.set(0.5, -1.9 - i * 0.3, 0.01);
            group.add(techMesh);
        });
        
        group.visible = true;
        this.panels.push(group);
        this.mainGroup.add(group);
    }
    
    createDevelopmentPanels() {
        // Create panels for sections 1 and 2 (Level Design and Graphics)
        const options = {
            custom: true,
            bgWidth: 5,
            bgHeight: 3,
            titleWidth: 5,
            titleHeight: 0.5,
            contentWidth: 5.2,
            contentHeight: 2.6,
            wrapLength: 59,
            fontSize: 18
        };

        [1, 2].forEach(sectionIndex => {
            const section = this.projectSections[sectionIndex];
            const group = new THREE.Group();
            
            // Section title
            const titleCanvas = this.createTextCanvas(
                section.title,
                700, 60,
                { fontSize: 30, color: '#7c3aed', bgColor: 'transparent' }
            );
            const titleMesh = new THREE.Mesh(
                new THREE.PlaneGeometry(7, 0.6),
                new THREE.MeshBasicMaterial({ map: titleCanvas, transparent: true })
            );
            titleMesh.position.y = 4.5;
            group.add(titleMesh);
            let secondaryImgHeight, extraImages = null;
            let imgHeight, lPanelCoords, rPanelCoords, img1Coords, img2Coords;

            if(sectionIndex === 1){
                extraImages = true;
                imgHeight = 4;
                secondaryImgHeight = 2;
                lPanelCoords = [-3.5, 1.9, 0.1];
                rPanelCoords = [3.5, -2, 0.1];
                img1Coords = [3.54, 1.6, 0.01];
                img2Coords = [-3.45, -1.7, 0.01];
            } else {
                extraImages = true;
                secondaryImgHeight = 3;
                imgHeight = 4;
                lPanelCoords = [-3.5, -1.9, 0.1];
                rPanelCoords = [3.5, 1.9, 0.1];
                img1Coords = [3.5, -1.65, 0.01];
                img2Coords = [-3.26, 1.65, 0.01];
            }

            // Left column
            this.imgLoader.load(section.imgPaths[0], (image) => {
                const texture = new THREE.Texture(image);
                texture.needsUpdate = true;
                const aspect = image.width / image.height;
                const width =  (imgHeight+0.12) * aspect;
                const imgMesh = new THREE.Mesh(
                    new THREE.PlaneGeometry(width, (imgHeight+0.12)),
                    this.createContrastMaterial(texture, 1.1, 0.02)
                );
                imgMesh.position.set(img1Coords[0], img1Coords[1], img1Coords[2]);
                group.add(imgMesh);
            });


            
            const leftPanel = this.createContentPanel(
                section.leftContent.title,
                section.leftContent.text,
                '#faf5ff',
                '#6b21a8',
                options
            );
            leftPanel.position.set(lPanelCoords[0], lPanelCoords[1], lPanelCoords[2]);
            group.add(leftPanel);


            // Right column  
            this.imgLoader.load(section.imgPaths[1], (image) => {
                const texture = new THREE.Texture(image);
                texture.needsUpdate = true;
                const aspect = image.width / image.height;
                const width = imgHeight * aspect;
                const imgMesh = new THREE.Mesh(
                    new THREE.PlaneGeometry(width, imgHeight),
                    this.createContrastMaterial(texture, 1.1, 0.02)
                );
            imgMesh.position.set(img2Coords[0], img2Coords[1], img2Coords[2]);
            group.add(imgMesh);
            });

            const rightPanel = this.createContentPanel(
                section.rightContent.title,
                section.rightContent.text,
                '#faf5ff',
                '#6b21a8',
                options
            );
            rightPanel.position.set(rPanelCoords[0], rPanelCoords[1], rPanelCoords[2]);
            group.add(rightPanel);

            if(extraImages){
                // Creates extra images on either side of main 2x2
                let images = [];
                let positions = [];
                let heights = [];
                if(sectionIndex === 1){
                    images = [this.imgNames.twoFlower, this.imgNames.cacti, this.imgNames.rocks];
                    positions = [[8.45, -2.6, 0.01], [7.35, -0.65, 0.01], [9.85, -0.65, 0.005]];
                    heights = [secondaryImgHeight, secondaryImgHeight-0.05, secondaryImgHeight-0.02];
                }else {
                    images = [this.imgNames.shadowCasting, this.imgNames.character];
                    positions = [[-7.71, 1.65, 0.005], [-7.3, -1.91, 0.001]]; 
                    heights = [secondaryImgHeight+1, secondaryImgHeight+0.15];                      
                }
                images.forEach((imgName, i) => {
                    this.imgLoader.load(this.folder + imgName, (image) => {
                        const texture = new THREE.Texture(image);
                        texture.needsUpdate = true;
                        const aspect = image.width / image.height;
                        const width = heights[i] * aspect;
                    const imgMesh = new THREE.Mesh(
                        new THREE.PlaneGeometry(width, heights[i]),
                        this.createContrastMaterial(texture, 1.1, 0.02)
                    );
                    imgMesh.position.set(...positions[i]);
                    group.add(imgMesh);
                });

                });
            }
            
            group.visible = false;
            this.panels.push(group);
            this.mainGroup.add(group);
        });
    }
    
    /**
     * 
     * @param {*} title 
     * @param {*} content 
     * @param {*} bgColor 
     * @param {*} titleColor 
     * @param {*} options:
        * custom: boolean - if false, uses default sizes and layout
        * bgWidth, bgHeight: numbers - background panel dimensions
        * titleWidth, titleHeight: numbers - title dimensions
        * contentWidth, contentHeight: numbers - content dimensions
        * wrapLength: number - max characters per line for content text
        * titleWrapLength: number - max characters per line for title text
        * 
     * @returns 
     */
    createContentPanel(title, content, bgColor = null, titleColor = null, options={}) {
        const group = new THREE.Group();
    
        // Background panel
        const bgGeometry = new THREE.PlaneGeometry(options.bgWidth || 6, options.bgHeight || 4.5);
        const bgMaterial = new THREE.MeshBasicMaterial({
            color: new THREE.Color(bgColor || this.contentBgColour),
            transparent: true,
            opacity: 0.9
        });
        const bgMesh = new THREE.Mesh(bgGeometry, bgMaterial);
        group.add(bgMesh);
        // Border
        const borderGeometry = new THREE.PlaneGeometry((options.bgWidth || 6)+0.1, (options.bgHeight || 4.5)+0.1);
        const borderMaterial = new THREE.MeshBasicMaterial({
            color: this.contentBorderColour,
            transparent: true,
            opacity: 0.5
        });
        const borderMesh = new THREE.Mesh(borderGeometry, borderMaterial);
        borderMesh.position.z = -0.01;
        group.add(borderMesh);

        // Panel title
        const titleCanvas = this.createTextCanvas(
            title,
            500, 50,
            { fontSize: 20, color: this.fontColour, bgColor: 'transparent' }
        );
        const titleMesh = new THREE.Mesh(
            new THREE.PlaneGeometry(options.titleWidth || 5, options.titleHeight || 0.5),
            new THREE.MeshBasicMaterial({ map: titleCanvas, transparent: true })
        );
        titleMesh.position.y = (options.bgHeight || 4.5)/2 - (options.titleHeight || 0.5)/2 - 0.1;
        titleMesh.position.z = 0.02;
        group.add(titleMesh);
        // Panel content - handle text wrapping
        

        const contentCanvLength = options.contentWidth ? options.contentWidth*104 : 500;

        const wrappedText = this.wrapText(content, options.wrapLength || 45);
        const contentCanvas = this.createMultiLineTextCanvas(
            wrappedText,
            contentCanvLength, contentCanvLength/2,
            { fontSize: 18, color: '#374151', bgColor: 'transparent' }
        );
        const contentMesh = new THREE.Mesh(
            new THREE.PlaneGeometry(options.contentWidth || 5.5, options.contentHeight || 3),
            new THREE.MeshBasicMaterial({ map: contentCanvas, transparent: true })
        );
        contentMesh.position.x = 0.1;
        contentMesh.position.y = titleMesh.position.y - (options.titleHeight || 0.5)/2 - (options.contentHeight || 3)/2 + 0.15;
        contentMesh.position.z = 0.02;
        group.add(contentMesh);
    

        return group;
    }
    
    createFeaturesPanel() {
        const section = this.projectSections[3];
        const group = new THREE.Group();
        
        // Section title
        const titleCanvas = this.createTextCanvas(
            section.title,
            700, 60,
            { fontSize: 30, color: '#7c3aed', bgColor: 'transparent' }
        );
        const titleMesh = new THREE.Mesh(
            new THREE.PlaneGeometry(7, 0.6),
            new THREE.MeshBasicMaterial({ map: titleCanvas, transparent: true })
        );
        titleMesh.position.y = 3;
        group.add(titleMesh);
        
        // Features section
        const featuresTitle = this.createTextCanvas(
            'Technical Features',
            450, 40,
            { fontSize: 22, color: '#059669', bgColor: 'transparent' }
        );
        const featuresTitleMesh = new THREE.Mesh(
            new THREE.PlaneGeometry(4.5, 0.4),
            new THREE.MeshBasicMaterial({ map: featuresTitle, transparent: true })
        );
        featuresTitleMesh.position.set(-3, 2.2, 0.01);
        group.add(featuresTitleMesh);
        
        // Features list
        section.content.features.forEach((feature, i) => {
            const featureCanvas = this.createTextCanvas(
                `⚡ ${feature}`,
                500, 30,
                { fontSize: 18, color: '#065f46', bgColor: 'transparent', align: 'left' }
            );
            const featureMesh = new THREE.Mesh(
                new THREE.PlaneGeometry(5, 0.3),
                new THREE.MeshBasicMaterial({ map: featureCanvas, transparent: true })
            );
            featureMesh.position.set(-3, 1.8 - i * 0.32, 0.01);
            group.add(featureMesh);
        });
        
        // Achievements section
        const achieveTitle = this.createTextCanvas(
            'Project Outcomes',
            450, 40,
            { fontSize: 22, color: '#dc2626', bgColor: 'transparent' }
        );
        const achieveTitleMesh = new THREE.Mesh(
            new THREE.PlaneGeometry(4.5, 0.4),
            new THREE.MeshBasicMaterial({ map: achieveTitle, transparent: true })
        );
        achieveTitleMesh.position.set(3, 2.2, 0.01);
        group.add(achieveTitleMesh);
        
        // Achievements list
        section.content.achievements.forEach((achievement, i) => {
            const achieveCanvas = this.createTextCanvas(
                `🎯 ${achievement}`,
                500, 30,
                { fontSize: 18, color: '#7f1d1d', bgColor: 'transparent', align: 'left' }
            );
            const achieveMesh = new THREE.Mesh(
                new THREE.PlaneGeometry(5, 0.3),
                new THREE.MeshBasicMaterial({ map: achieveCanvas, transparent: true })
            );
            achieveMesh.position.set(3, 1.8 - i * 0.32, 0.01);
            group.add(achieveMesh);
        });
        
        group.visible = false;
        this.panels.push(group);
        this.mainGroup.add(group);
    }
    
    createNavigationButtons() {
        const buttonGroup = new THREE.Group();
        buttonGroup.position.y = -3.8;
        buttonGroup.position.z = 1;
        
        const buttonLabels = ['Overview', 'Level Design', 'Graphics Engine', 'Features'];
        
        buttonLabels.forEach((label, i) => {
            const geometry = new THREE.BoxGeometry(2.8, 0.6, 0.2);
            const material = new THREE.MeshStandardMaterial({
                color: i === 0 ? 0x7c3aed : 0x6b7280,
                emissive: i === 0 ? 0x5b21b6 : 0x000000,
                emissiveIntensity: 0.2
            });
            
            const button = new THREE.Mesh(geometry, material);
            button.position.x = (i - 1.5) * 3.2;
            button.userData = { viewIndex: i, isButton: true };
            
            // Button text
            const textCanvas = this.createTextCanvas(label, 280, 60, { 
                fontSize: 15, 
                color: i === 0 ? '#ffffff' : '#e5e7eb' 
            });
            const textMesh = new THREE.Mesh(
                new THREE.PlaneGeometry(2.6, 0.5),
                new THREE.MeshBasicMaterial({ map: textCanvas, transparent: true })
            );
            textMesh.position.z = 0.11;
            button.add(textMesh);
            
            this.makeInteractive(button);
            buttonGroup.add(button);
        });
        
        this.navigationButtons = buttonGroup;
        this.mainGroup.add(buttonGroup);
    }
    
    createTextCanvas(text, width, height, options = {}) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        const scale = window.devicePixelRatio || 1;
        canvas.width = width * scale;
        canvas.height = height * scale;

        ctx.scale(scale, scale);
        ctx.imageSmoothingEnabled = true;
            
        if (options.bgColor && options.bgColor !== 'transparent') {
            ctx.fillStyle = options.bgColor;
            ctx.fillRect(0, 0, width, height);
        }
        
        ctx.fillStyle = options.color || '#ffffff';
        ctx.font = `${options.fontSize || 20}px Arial`;
        ctx.textAlign = options.align || 'center';
        ctx.textBaseline = 'middle';
        
        if (options.wrap && options.align === 'left') {
            // Handle wrapped text for left alignment
            const lines = this.wrapText(text, 50);
            const lineHeight = options.fontSize * 1.2;
            const startY = (height - (lines.length * lineHeight)) / 2 + lineHeight / 2;
            
            lines.forEach((line, i) => {
                ctx.fillText(line, 20, startY + i * lineHeight);
            });
        } else {
            const x = options.align === 'left' ? 20 : width / 2;
            ctx.fillText(text, x, height / 2);
        }
            
        const tex = new THREE.CanvasTexture(canvas);
        tex.minFilter = THREE.LinearFilter;
        tex.magFilter = THREE.LinearFilter;
        tex.anisotropy = this.renderer.capabilities.getMaxAnisotropy();
        tex.needsUpdate = true;

        return tex;
    }
    
    createMultiLineTextCanvas(lines, width, height, options = {}) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        const scale = window.devicePixelRatio || 1;
        canvas.width = width * scale;
        canvas.height = height * scale;

        ctx.scale(scale, scale);
        ctx.imageSmoothingEnabled = true;
            
        if (options.bgColor && options.bgColor !== 'transparent') {
            ctx.fillStyle = options.bgColor;
            ctx.fillRect(0, 0, width, height);
        }
        
        ctx.fillStyle = options.color || '#ffffff';
        ctx.font = `${options.fontSize || 18}px Arial`;
        ctx.textAlign = 'left';
        
        const lineHeight = options.fontSize * 1.3;
        const startY = options.fontSize + 10;
        
        lines.forEach((line, i) => {
            ctx.fillText(line, 20, startY + i * lineHeight);
        });
            
        const tex = new THREE.CanvasTexture(canvas);
        tex.minFilter = THREE.LinearFilter;
        tex.magFilter = THREE.LinearFilter;
        tex.anisotropy = this.renderer.capabilities.getMaxAnisotropy();
        tex.needsUpdate = true;

        return tex;
    }
    
    wrapText(text, maxCharsPerLine) {
        const words = text.split(' ');
        const lines = [];
        let currentLine = '';
        let testLine;
        words.forEach(word => {
            testLine = currentLine + (currentLine ? ' ' : '') + word;
            if (testLine.length <= maxCharsPerLine) {
                currentLine = testLine; // add word to current line
            } else {
                if (currentLine) {
                    //if current line has content, push it
                    lines.push(currentLine);
                    currentLine = word;
                }
                currentLine = word; // if word longer than max, it will be on its own line
            }
        });
        
        if (currentLine) lines.push(currentLine); // last line
        return lines;
    }
    
    showView(index) {
        // Show the correct panel
        this.panels.forEach((panel, i) => {
            panel.visible = (i === index);
        });

        // Update button states
        if (this.navigationButtons) {
            this.navigationButtons.children.forEach((button, i) => {
                const isActive = i === index;

                button.material.color.setHex(isActive ? 0x7c3aed : 0x6b7280);
                button.material.emissive = new THREE.Color(isActive ? 0x5b21b6 : 0x000000);
                button.material.emissiveIntensity = isActive ? 0.2 : 0.0;
                
                const textMesh = button.children[0];
                if (textMesh) {
                    const buttonLabels = ['Overview', 'Level Design', 'Graphics Engine', 'Features'];
                    const textCanvas = this.createTextCanvas(
                        buttonLabels[i], 
                        280, 60, 
                        { 
                            fontSize: 15, 
                            color: isActive ? '#ffffff' : '#e5e7eb' 
                        }
                    );
                    textMesh.material.map = textCanvas;
                    textMesh.material.needsUpdate = true;
                }
            });
        }

        this.currentView = index;
    }
    
    onObjectClick(intersection) {
        const object = intersection.object;
        if (object.userData && object.userData.isButton) {
            this.showView(object.userData.viewIndex);
        }
    }
    
    onMouseIntersect(intersects) {
        // Reset all buttons
        if (this.navigationButtons) {
            this.navigationButtons.children.forEach(button => {
                button.userData.isHovered = false;
            });
        }
        
        // Check for button hover
        if (intersects.length > 0) {
            const object = intersects[0].object;
            if (object.userData && object.userData.isButton) {
                object.userData.isHovered = true;
                document.body.style.cursor = 'pointer';
            } else {
                document.body.style.cursor = 'default';
            }
        } else {
            document.body.style.cursor = 'default';
        }
    }
    
    animate(deltaTime, elapsedTime) {
        super.animate(deltaTime, elapsedTime);
        
        // Hover effect for buttons
        if (this.navigationButtons) {
            this.navigationButtons.children.forEach(button => {
                if (button.userData.isHovered) {
                    button.scale.setScalar(1.05);
                } else {
                    button.scale.setScalar(1);
                }
            });
        }
    }
    
    onShow() {
        console.log('THREE.js Game Project active');
        if (this.mainGroup) {
            this.mainGroup.visible = true;
        }
        this.showView(0);
        
        // Animate in
        if (this.mainGroup) {
            this.mainGroup.scale.setScalar(0);
            const animateIn = () => {
                const scale = this.mainGroup.scale.x;
                const newScale = scale + (1 - scale) * 0.1;
                this.mainGroup.scale.setScalar(newScale);
                
                if (Math.abs(newScale - 1) > 0.01) {
                    requestAnimationFrame(animateIn);
                }
            };
            animateIn();
        }
    }
    
    onHide() {
        if (this.mainGroup) {
            this.mainGroup.visible = false;
        }
        document.body.style.cursor = 'default';
    }
}

export { ThreeJSGameProject };

export { InteractiveGallery, ParticleSystem, CompPhysics };