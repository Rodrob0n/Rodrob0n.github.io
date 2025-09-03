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


class SignLanguageProject extends Project {
    constructor(scene, camera, renderer) {
        super(scene, camera, renderer, {
            name: 'Sign Language Translator',
            autoRotate: false,
            animationSpeed: 0.5,
            responsive: true
        });

        this.handModel = null;
        this.lstmVisualisation = null;
        this.dataFlow = [];
        this.landmarks = [];
        this.neuralNetwork = null;
        this.outputDisplay = null;

        this.currentDemo = 0;
        this.demoSigns = ['Family', 'Fire', 'Hello', 'Get Together', 'Love'];
        this.isProcessing = false;
    }

    create() {
        this.mainGroup = new THREE.Group();
        
        // Create a simple placeholder for now
        const geometry = new THREE.BoxGeometry(2, 2, 2);
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff88 });
        const cube = new THREE.Mesh(geometry, material);
        
        this.mainGroup.add(cube);
        this.addObject(this.mainGroup);
    }
    
    animate(deltaTime, elapsedTime) {
        super.animate(deltaTime, elapsedTime);
        
        if (this.mainGroup) {
            this.mainGroup.rotation.y += deltaTime * 0.5;
        }
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
        
        // Store your example data
        this.examples = [
            {
                title: 'Control Flow Example',
                description: 'While loop compilation',
                sourceCode: `// MiniC program to test while loop
extern int print_int(int X);

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
                irContent: `LLVM IR Output:
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
        this.examples.forEach((example, index) => {
            const exampleGroup = new THREE.Group();
            const titleCanvas = this.createTextCanvas(
                example.title,
                400, 50,
                { fontSize: 24, color: '#00ff88', bgColor: 'transparent' }
            );
            const titleMesh = new THREE.Mesh(
                new THREE.PlaneGeometry(4, 0.5),
                new THREE.MeshBasicMaterial({ map: titleCanvas, transparent: true })
            );
            titleMesh.position.y = 3;
            exampleGroup.add(titleMesh);

            const panelWidth = 3.5;
            const panelHeight = 5;
            const spacing = 4.5;
            
            // Source code panel (left)
            const codePanel = this.createCodePanel(
                example.sourceCode,
                'Source Code',
                '#1a1a2e',
                panelWidth,
                panelHeight,
                this.renderer
            );
            codePanel.position.set(-spacing, -0.5, 0);
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
            astPanel.position.set(0, -0.5, 0);
            exampleGroup.add(astPanel);
            
            // IR panel (right)
            const irPanel = this.createCodePanel(
                example.irContent,
                'LLVM IR',
                '#0f3460',
                panelWidth,
                panelHeight,
                this.renderer
            );
            irPanel.position.set(spacing, -0.5, 0);
            exampleGroup.add(irPanel);
            
            // Add flow arrows between panels
            this.createFlowArrows(exampleGroup, spacing);
        
            exampleGroup.scale.setScalar(1.2);

            exampleGroup.visible = false;
            this.panels.push(exampleGroup);
            this.mainGroup.add(exampleGroup);
        
        });
    }
    
    createCodePanel(content, title, bgColor, panelWidth, panelHeight, renderer) {
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
            color: 0x00ff88,
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
        
        ctx.font = '24px Consolas, monospace';
        const lines = content.split('\n');
        
        lines.forEach((line, i) => {
            const y = 30 + i * 20;
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
        const buttons = ['Overview', 'Example: While Loop', 'Nex'];
        
        buttons.forEach((text, i) => {
            const geometry = new THREE.BoxGeometry(2.2, 0.6, 0.2);
            const material = new THREE.MeshStandardMaterial({
                color: i === 0 ? 0x00ff88 : 0x444444,
                emissive: i === 0 ? 0x00ff88 : 0x000000,
                emissiveIntensity: 0.2
            });
            
            const button = new THREE.Mesh(geometry, material);
            button.position.x = (i - 1) * 2.5;
            button.userData = { viewIndex: Math.min(i, 1), isButton: true }; // "Next" maps to view 0
            
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
        arrow1.position.set(-spacing/2, -0.5, 0.5);
        arrow1.rotation.z = -Math.PI / 2;
        group.add(arrow1);
        
        // Arrow from AST to IR
        const arrow2 = new THREE.Mesh(arrowGeometry, arrowMaterial);
        arrow2.position.set(spacing/2, -0.5, 0.5);
        arrow2.rotation.z = -Math.PI / 2;
        group.add(arrow2);
        
        this.arrows = [arrow1, arrow2];
    }
    
    showView(index) {
        // Hide all panels
        this.panels.forEach((panel, i) => {
            panel.visible = i === index;
        });
        
        // Update button states
        if (this.navigationButtons) {
            this.navigationButtons.children.forEach((button, i) => {
                const isActive = (i === index) || (i === 2 && index === 0); // "Next" active on overview
                button.material.color.setHex(isActive ? 0x00ff88 : 0x444444);
                button.material.emissive = new THREE.Color(isActive ? 0x00ff88 : 0x000000);
                
                // Update text color
                const textMesh = button.children[0];
                if (textMesh) {
                    const text = ['Overview', 'Example: While Loop', 'Next →'][i];
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
            const viewIndex = object.userData.viewIndex;
            // If "Next" button clicked on overview, go to example
            if (this.currentView === 0 && viewIndex === 0 && object.position.x > 0) {
                this.showView(1);
            } else {
                this.showView(viewIndex);
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
                name: 'custom-project-3',
                title: 'Physics Demo',
                color: 0xf9ca24,
                description: 'Physics simulation'
            },
            {
                name: 'custom-project-4',
                title: 'Rotating Logo',
                color: 0xf0932b,
                description: '3D data visualization'
            }
        ];
    }
    
    create() {
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
            cube.position.x = (i - 2) * 3; // Spread them out more
            cube.position.y = 0;
            cube.position.z = 0;
            
            // Store original color and project mapping
            this.originalColors.set(cube, config.color);
            this.projectMapping.set(cube, config.name);
            
            // Create text label for the cube
            this.createLabel(cube, config);
            
            // Add to scene
            this.addObject(cube);
            this.makeInteractive(cube);
            this.cubes.push(cube);
        });
        
        // Add a title
        this.createTitle();
        
        console.log(`${this.config.name}: Created ${this.cubes.length} project cubes`);
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

export default InteractiveGallery;


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

export { InteractiveGallery, ParticleSystem };