export type Lang = "pt" | "en";

const dictionaries = {
  pt: {
    // Nav
    nav_work: "Trabalhos",
    nav_experiments: "Experimentos",
    nav_cta: "Fale Comigo",

    // Hero
    hero_location: "RIO DE JANEIRO, RJ, BRASIL",
    hero_title_1: "Identidades visuais marcantes &",
    hero_title_highlight: "experiências imersivas.",
    hero_sub_1: "Sou uma designer multidisciplinar que une sistemas visuais e estética experimental para construir marcas e sites que",
    hero_sub_highlight: "se destacam.",

    // Spread Cards
    card_uxui_title: "UX/UI Design",
    card_uxui_desc: "Criando interfaces digitais intuitivas que unem performance técnica e estética refinada para experiências imersivas.",
    card_creative_title: "Tecnologia Criativa",
    card_creative_desc: "Explorando código e arte generativa para criar soluções interativas que desafiam o design tradicional e a lógica de máquina.",
    card_artdir_title: "Direção de Arte",
    card_artdir_desc: "Desenvolvendo identidades visuais impactantes e projetos editoriais brutais com uma linguagem única e contemporânea.",

    // Selected Work
    selected_work: "Trabalhos Selecionados",
    view_project: "Ver Projeto",
    rm_scroll: "role para ver ↓",
    rm_tools_label: "Ferramentas",
    rm_welcome: "oi! que bom te ver no meu cantinho da internet ✳",
    rm_footer_label: "Contato",
    rm_footer_talk: "vamos conversar?",
    rm_footer_made: "feito no rio, com next.js e carinho",

    // Project 01 - Isadora
    p01_tag1: "Direção de Arte",
    p01_tag2: "Editorial",
    p01_desc: "Um press kit digital brutalista e sofisticado para a atriz Isadora Ruppert, com estética de papel rasgado e cores do Hollywood vintage.",

    // Project 02 - Helvetica
    p02_title: "Helvetica:\nDiscórdia",
    p02_tag1: "Grunge",
    p02_tag2: "Editorial",
    p02_desc: "Um projeto editorial que opõe a neutralidade da Helvetica ao caos do estilo grunge, inspirado por David Carson.",

    // Project 03 - GenLab
    p03_tag1: "Tecnologia Criativa",
    p03_tag2: "Arte Generativa",
    p03_desc: "Um laboratório experimental focado em código e arte generativa, explorando a intersecção entre a filosofia humana e a lógica de máquina.",

    // Project 04 - EBAT
    p04_title: "EBAT:\nArte & Tecnologia",
    p04_tag1: "Design Gráfico",
    p04_tag2: "Social Media",
    p04_desc: "Campanha audiovisual para o São Paulo Innovation Week (SPIW) e identidade visual para redes sociais.",

    // Process
    process_headline: "Como abordo o\ndesenvolvimento criativo",
    process_sub: "Cada projeto é um equilíbrio entre design sistemático e engenharia criativa. Construo ferramentas que escalam e experiências com um toque artesanal.",
    process_01_title: "Descoberta & Estratégia",
    process_01_desc: "Entender o problema central, as necessidades do usuário e os objetivos de negócio antes de escrever qualquer linha de código.",
    process_02_title: "Sistemas de Design",
    process_02_desc: "Estabelecer uma linguagem visual robusta e uma biblioteca de componentes que garantam consistência em todo o produto.",
    process_03_title: "Engenharia Criativa",
    process_03_desc: "Dar vida ao design com código focado em performance, animações fluidas e acessibilidade.",
    process_04_title: "Iteração & Refinamento",
    process_04_desc: "Refinar a experiência através de testes, feedback e atenção meticulosa às microinterações.",

    // About
    about_title: "Minibio",
    about_text: "Designer multidisciplinar com base em pesquisa acadêmica. Construo interfaces e identidades visuais onde rigor técnico encontra estética contemporânea — do conceito ao código.",
    about_nano_sub: "Pesquisadora",
    about_laid_sub: "Integrante",
    about_cat_visual: "Design Visual",
    about_cat_web: "Web & Código",
    about_cat_creative: "Tecnologia Criativa",
    about_tool_gen_ai: "IA Generativa",

    // Capabilities
    cap_title: "Minhas Capacidades",
    cap_sub: "Equilibrando estética experimental e usabilidade refinada para criar marcas e experiências digitais memoráveis.",
    cap_graphic: "Design Gráfico",
    cap_webui: "Web & UI Design",
    cap_artdir: "Direção de Arte",
    cap_identity: "Identidade Visual",
    cap_creative: "Tecnologia Criativa",
    cap_genai: "IA Generativa",
    cap_proto: "Prototipagem",

    // Footer
    footer_heading: "Vamos conversar sobre\no seu projeto.",
    footer_sub: "Tem um projeto em mente? Podemos transformar essa ideia em um produto real.",
    footer_cta: "Fale Comigo",
    footer_cv: "Currículo",

    // Work Page
    work_page_title: "Trabalhos Selecionados",
    work_page_sub: "Explore alguns dos meus projetos recentes, onde uno design sistemático, direção de arte e estética experimental para criar narrativas digitais únicas.",
    work_isadora_tags: "Direção de Arte, Design Editorial",
    work_isadora_desc: "Um press kit digital com estética brutalista de alto padrão para a atriz Isadora Ruppert. Apresenta visuais de papel rasgado, cores vintage de Hollywood e colagens editoriais marcantes.",
    work_helvetica_title: "HELVETICA:\nA Fonte da Discórdia",
    work_helvetica_tags: "Editorial, Grunge, Tipografia",
    work_helvetica_desc: "Um projeto editorial que opõe a neutralidade da Helvetica ao caos do estilo grunge (David Carson), quebrando as regras de grid.",
    work_genlab_tags: "Tecnologia Criativa, Pesquisa, IA",
    work_genlab_desc: "Um laboratório de pesquisa focado na intersecção entre arte generativa e tecnologia. Análises críticas de algoritmos e estética digital.",
    work_ebat_title: "EBAT:\nArte & Tecnologia",
    work_ebat_tags: "Design Gráfico, Social Media",
    work_ebat_desc: "Campanha audiovisual para o São Paulo Innovation Week (SPIW) e identidade visual para redes sociais.",

    // Experiments Page
    exp_title: "Experimentos",
    exp_sub: "Uma biblioteca imersiva de arte generativa e explorações computacionais. Cada experimento roda em tempo real no seu navegador usando algoritmos nativos e Canvas.",
    exp_close: "Fechar ×",
    exp_flow_title: "Campo de Fluxo",
    exp_flow_desc: "1200 partículas navegando em um campo vetorial contínuo de ruído Perlin. Observe padrões emergentes se formarem e dissolverem.",
    exp_flow_tags: "Ruído Perlin,Partículas,Generativo",
    exp_rd_title: "Reação-Difusão",
    exp_rd_desc: "Modelo Gray-Scott simulando dois componentes químicos virtuais que interagem e produzem padrões orgânicos de crescimento.",
    exp_rd_tags: "Simulação,Gray-Scott,Orgânico",
    exp_tree_title: "Árvore Fractal",
    exp_tree_desc: "Uma árvore desenhada recursivamente cujo ângulo de ramificação segue o seu mouse. Mova o cursor para moldar a copa.",
    exp_tree_tags: "Recursão,Interativo,Fractal",
    exp_voronoi_title: "Células de Voronoi",
    exp_voronoi_desc: "24 pontos semente animados gerando uma tesselação de Voronoi viva. As bordas emergem a partir de relações de proximidade.",
    exp_voronoi_tags: "Geometria,Tesselação,Tempo Real",
    exp_lorenz_title: "Atrator de Lorenz",
    exp_lorenz_desc: "O famoso sistema caótico renderizado em tempo real. Um atrator estranho em forma de borboleta traça o caos determinístico.",
    exp_lorenz_tags: "Teoria do Caos,3D,Matemática",

    // Isadora Project Page
    isadora_back: "← Voltar para Trabalhos Selecionados",
    isadora_subtitle: "Um press kit digital brutalista para a atriz Isadora Ruppert, misturando",
    isadora_highlight1: "cores vintage de Hollywood",
    isadora_highlight2: "estética editorial caótica e moderna.",
    isadora_meta_client: "Cliente",
    isadora_meta_role: "Atuação",
    isadora_meta_role_val: "Direção de Arte, Editorial",
    isadora_meta_year: "Ano",
    isadora_vertical_title: "Kit Vertical",
    isadora_vertical_sub: "Versão otimizada para visualização mobile e redes sociais.",

    // Magazine Project Page
    magazine_back: "← Voltar para Trabalhos",
    magazine_grunge_label: "A fonte da discórdia",
    magazine_p1: "Conhecida por sua clareza e neutralidade absoluta, a Helvetica foi",
    magazine_p1_highlight: "projetada para ser invisível",
    magazine_p1_rest: "— uma tipografia puramente funcional e desprovida de significados ocultos. Não é à toa que se tornou o padrão ouro para a publicidade global e a leitura de textos corridos.",
    magazine_p2: "Buscando inspiração na estética pós-moderna, no movimento grunge e na genialidade subversiva de David Carson, este projeto editorial nasce como um",
    magazine_p2_highlight: "manifesto contra a previsibilidade.",
    magazine_p2_rest: "O estilo grunge se rebela ativamente contra a rigidez suíça: destrói terminações perfeitas, ignora pesos monótonos e ataca a suposta \"falta de personalidade\" da fonte mais famosa do mundo.",
    magazine_p3: "O desafio no design desta revista foi encontrar o atrito perfeito entre o caos do grunge e a precisão da Helvetica. Esse contraste conceitual traduz visualmente o embate central discutido tanto no lendário documentário da fonte quanto na entrevista desconstruída neste layout.",

    // GenLab Project Page
    genlab_subtitle: "Projeto 03 — Laboratório de Pesquisa",
    genlab_title: "GenLab: Ideias que moldam\n o mundo digital.",
    genlab_desc: "Laboratório experimental focado em código,",
    genlab_highlight1: "arte generativa",
    genlab_desc2: "e UI/UX imersiva. Explorando a interseção entre filosofia humana e",
    genlab_highlight2: "lógica de máquina.",
    genlab_meta_platform: "Plataforma",
    genlab_meta_platform_val: "Editorial & Laboratório",
    genlab_meta_services: "Serviços",
    genlab_meta_services_val: "Tecnologia Criativa, Pesquisa",
    genlab_meta_status: "Status",
    genlab_meta_status_val: "Pesquisa Ativa",
    genlab_feature_title: "Um Laboratório de Pesquisa para Tecnologia Criativa",
    genlab_feature_p1: "O GenLab é um laboratório digital independente e uma plataforma editorial dedicada à análise crítica de algoritmos generativos, programação criativa e estética digital moderna.",
    genlab_feature_p2: "Eu crio uma ponte entre conceitos abstratos de ciência da computação e o design centrado no humano, oferecendo análises profundas de como a lógica da máquina molda nossos ambientes físicos e online.",
    genlab_visit: "Visite o GenLab",
    genlab_access: "Acessar Site",
    genlab_back: "Voltar para Trabalhos",

    // EBAT Project Page
    ebat_back: "← Voltar para a Home",
    ebat_title: "EBAT - Escola de Arte e Tecnologia",
    ebat_desc: "A EBAT (Escola Brasileira de Arte e Tecnologia) é uma escola laboratório 100% gratuita de arte, inovação e tecnologia voltada para quem deseja se posicionar na nova economia criativa. Atuei diretamente como designer da escola, ajudando a traduzir o",
    ebat_desc_highlight: "pensamento criativo",
    ebat_desc_rest: "para a identidade visual de campanhas, módulos de ensino e redes sociais.",
    ebat_meta_client: "Cliente",
    ebat_meta_role: "Atuação",
    ebat_meta_role_val: "Design Gráfico, Social Media, Audiovisual",
    ebat_meta_year: "Ano",
    ebat_spiw_title: "Campanha SPIW",
    ebat_spiw_desc: "No São Paulo Innovation Week (SPIW), a EBAT apresentou sua visão sobre a relação entre arte e tecnologia. O foco do evento foi mostrar na prática como o design e o pensamento criativo se integram ao ecossistema de inovação, consolidando a escola como um espaço ativo para essas discussões na cidade.",
    ebat_manual_title: "Manual de Marca",
    ebat_manual_desc: "Redesign completo da identidade visual da EBAT: diretrizes de logotipo, paleta de cores, tipografia, tom de voz e aplicações. Um sistema para manter a marca consistente em todos os pontos de contato.",
    ebat_social_title: "Redes Sociais",

    // Metadata
    meta_description: "Designer multidisciplinar. Projetos em Design Gráfico, Web Design, UX/UI e Programação Criativa.",
  },

  en: {
    // Nav
    nav_work: "Work",
    nav_experiments: "Experiments",
    nav_cta: "Get in Touch",

    // Hero
    hero_location: "RIO DE JANEIRO, RJ, BRAZIL",
    hero_title_1: "Striking visual identities &",
    hero_title_highlight: "immersive experiences.",
    hero_sub_1: "I'm a multidisciplinary designer who combines visual systems and experimental aesthetics to build brands and websites that",
    hero_sub_highlight: "stand out.",

    // Spread Cards
    card_uxui_title: "UX/UI Design",
    card_uxui_desc: "Crafting intuitive digital interfaces that merge technical performance and refined aesthetics for immersive experiences.",
    card_creative_title: "Creative Technology",
    card_creative_desc: "Exploring code and generative art to create interactive solutions that challenge traditional design and machine logic.",
    card_artdir_title: "Art Direction",
    card_artdir_desc: "Developing impactful visual identities and bold editorial projects with a unique, contemporary language.",

    // Selected Work
    selected_work: "Selected Work",
    view_project: "View Project",
    rm_scroll: "scroll to explore ↓",
    rm_tools_label: "Tools",
    rm_welcome: "hi! welcome to my little corner of the internet ✳",
    rm_footer_label: "Contact",
    rm_footer_talk: "let's talk?",
    rm_footer_made: "made in rio, with next.js and love",

    // Project 01 - Isadora
    p01_tag1: "Art Direction",
    p01_tag2: "Editorial",
    p01_desc: "A brutalist and sophisticated digital press kit for actress Isadora Ruppert, featuring torn paper aesthetics and vintage Hollywood colors.",

    // Project 02 - Helvetica
    p02_title: "Helvetica:\nDiscord",
    p02_tag1: "Grunge",
    p02_tag2: "Editorial",
    p02_desc: "An editorial project that pits Helvetica's neutrality against the chaos of grunge style, inspired by David Carson.",

    // Project 03 - GenLab
    p03_tag1: "Creative Technology",
    p03_tag2: "Generative Art",
    p03_desc: "An experimental lab focused on code and generative art, exploring the intersection between human philosophy and machine logic.",

    // Project 04 - EBAT
    p04_title: "EBAT:\nArt & Technology",
    p04_tag1: "Graphic Design",
    p04_tag2: "Social Media",
    p04_desc: "Audiovisual campaign for São Paulo Innovation Week (SPIW) and visual identity for social media.",

    // Process
    process_headline: "How I approach\ncreative development",
    process_sub: "Every project is a balance between systematic design and creative engineering. I build tools that scale and experiences with a handcrafted touch.",
    process_01_title: "Discovery & Strategy",
    process_01_desc: "Understanding the core problem, user needs and business goals before writing a single line of code.",
    process_02_title: "Design Systems",
    process_02_desc: "Establishing a robust visual language and component library that ensures consistency across the entire product.",
    process_03_title: "Creative Engineering",
    process_03_desc: "Bringing design to life with performance-focused code, fluid animations and accessibility.",
    process_04_title: "Iteration & Refinement",
    process_04_desc: "Refining the experience through testing, feedback and meticulous attention to micro-interactions.",

    // About
    about_title: "About",
    about_text: "Multidisciplinary designer with an academic research background. I build interfaces and visual identities where technical rigor meets contemporary aesthetics — from concept to code.",
    about_nano_sub: "Researcher",
    about_laid_sub: "Member",
    about_cat_visual: "Visual Design",
    about_cat_web: "Web & Code",
    about_cat_creative: "Creative Technology",
    about_tool_gen_ai: "Generative AI",

    // Capabilities
    cap_title: "My Capabilities",
    cap_sub: "Balancing experimental aesthetics and refined usability to create memorable brands and digital experiences.",
    cap_graphic: "Graphic Design",
    cap_webui: "Web & UI Design",
    cap_artdir: "Art Direction",
    cap_identity: "Visual Identity",
    cap_creative: "Creative Technology",
    cap_genai: "Generative AI",
    cap_proto: "Prototyping",

    // Footer
    footer_heading: "Let's talk about\nyour project.",
    footer_sub: "Have a project in mind? We can turn that idea into a real product.",
    footer_cta: "Get in Touch",
    footer_cv: "Resume",

    // Work Page
    work_page_title: "Selected Work",
    work_page_sub: "Explore some of my recent projects, where I combine systematic design, art direction and experimental aesthetics to create unique digital narratives.",
    work_isadora_tags: "Art Direction, Editorial Design",
    work_isadora_desc: "A high-end brutalist digital press kit for actress Isadora Ruppert. Features torn paper visuals, vintage Hollywood colors and bold editorial collages.",
    work_helvetica_title: "HELVETICA:\nThe Font of Discord",
    work_helvetica_tags: "Editorial, Grunge, Typography",
    work_helvetica_desc: "An editorial project that pits Helvetica's neutrality against grunge chaos (David Carson), breaking the rules of the grid.",
    work_genlab_tags: "Creative Technology, Research, AI",
    work_genlab_desc: "A research lab focused on the intersection between generative art and technology. Critical analysis of algorithms and digital aesthetics.",
    work_ebat_title: "EBAT:\nArt & Technology",
    work_ebat_tags: "Graphic Design, Social Media",
    work_ebat_desc: "Audiovisual campaign for São Paulo Innovation Week (SPIW) and visual identity for social media.",

    // Experiments Page
    exp_title: "Experiments",
    exp_sub: "An immersive library of generative art and computational explorations. Each experiment runs in real time in your browser using native algorithms and Canvas.",
    exp_close: "Close ×",
    exp_flow_title: "Flow Field",
    exp_flow_desc: "1200 particles navigating a continuous Perlin noise vector field. Watch emergent patterns form and dissolve.",
    exp_flow_tags: "Perlin Noise,Particles,Generative",
    exp_rd_title: "Reaction-Diffusion",
    exp_rd_desc: "Gray-Scott model simulating two virtual chemical components that interact and produce organic growth patterns.",
    exp_rd_tags: "Simulation,Gray-Scott,Organic",
    exp_tree_title: "Fractal Tree",
    exp_tree_desc: "A recursively drawn tree whose branching angle follows your mouse. Move the cursor to shape the canopy.",
    exp_tree_tags: "Recursion,Interactive,Fractal",
    exp_voronoi_title: "Voronoi Cells",
    exp_voronoi_desc: "24 animated seed points generating a living Voronoi tessellation. Edges emerge from proximity relationships.",
    exp_voronoi_tags: "Geometry,Tessellation,Real-Time",
    exp_lorenz_title: "Lorenz Attractor",
    exp_lorenz_desc: "The famous chaotic system rendered in real time. A butterfly-shaped strange attractor traces deterministic chaos.",
    exp_lorenz_tags: "Chaos Theory,3D,Mathematics",

    // Isadora Project Page
    isadora_back: "← Back to Selected Work",
    isadora_subtitle: "A brutalist digital press kit for actress Isadora Ruppert, blending",
    isadora_highlight1: "vintage Hollywood colors",
    isadora_highlight2: "chaotic and modern editorial aesthetics.",
    isadora_meta_client: "Client",
    isadora_meta_role: "Role",
    isadora_meta_role_val: "Art Direction, Editorial",
    isadora_meta_year: "Year",
    isadora_vertical_title: "Vertical Kit",
    isadora_vertical_sub: "Optimized version for mobile and social media viewing.",

    // Magazine Project Page
    magazine_back: "← Back to Work",
    magazine_grunge_label: "The font of discord",
    magazine_p1: "Known for its clarity and absolute neutrality, Helvetica was",
    magazine_p1_highlight: "designed to be invisible",
    magazine_p1_rest: "— a purely functional typeface devoid of hidden meanings. It's no wonder it became the gold standard for global advertising and body text.",
    magazine_p2: "Drawing inspiration from postmodern aesthetics, the grunge movement and the subversive genius of David Carson, this editorial project was born as a",
    magazine_p2_highlight: "manifesto against predictability.",
    magazine_p2_rest: "Grunge style actively rebels against Swiss rigidity: it destroys perfect endings, ignores monotonous weights and attacks the supposed \"lack of personality\" of the world's most famous font.",
    magazine_p3: "The challenge in designing this magazine was finding the perfect friction between grunge chaos and Helvetica's precision. This conceptual contrast visually translates the central clash discussed in both the legendary font documentary and the deconstructed interview in this layout.",

    // GenLab Project Page
    genlab_subtitle: "Project 03 — Research Lab",
    genlab_title: "GenLab: Ideas that shape\n the digital world.",
    genlab_desc: "Experimental lab focused on code,",
    genlab_highlight1: "generative art",
    genlab_desc2: "and immersive UI/UX. Exploring the intersection between human philosophy and",
    genlab_highlight2: "machine logic.",
    genlab_meta_platform: "Platform",
    genlab_meta_platform_val: "Editorial & Lab",
    genlab_meta_services: "Services",
    genlab_meta_services_val: "Creative Technology, Research",
    genlab_meta_status: "Status",
    genlab_meta_status_val: "Active Research",
    genlab_feature_title: "A Research Lab for Creative Technology",
    genlab_feature_p1: "GenLab is an independent digital lab and editorial platform dedicated to the critical analysis of generative algorithms, creative coding and modern digital aesthetics.",
    genlab_feature_p2: "I bridge abstract computer science concepts and human-centered design, offering deep analysis of how machine logic shapes our physical and online environments.",
    genlab_visit: "Visit GenLab",
    genlab_access: "Go to Site",
    genlab_back: "Back to Work",

    // EBAT Project Page
    ebat_back: "← Back to Home",
    ebat_title: "EBAT - School of Art and Technology",
    ebat_desc: "EBAT (Brazilian School of Art and Technology) is a 100% free lab-school for art, innovation and technology aimed at those who want to position themselves in the new creative economy. I worked directly as the school's designer, helping translate",
    ebat_desc_highlight: "creative thinking",
    ebat_desc_rest: "into the visual identity of campaigns, teaching modules and social media.",
    ebat_meta_client: "Client",
    ebat_meta_role: "Role",
    ebat_meta_role_val: "Graphic Design, Social Media, Audiovisual",
    ebat_meta_year: "Year",
    ebat_spiw_title: "SPIW Campaign",
    ebat_spiw_desc: "At the São Paulo Innovation Week (SPIW), EBAT presented its vision on the relationship between art and technology. The event's focus was to show in practice how design and creative thinking integrate into the innovation ecosystem, establishing the school as an active space for these discussions in the city.",
    ebat_manual_title: "Brand Manual",
    ebat_manual_desc: "A full redesign of EBAT's visual identity: logo guidelines, color palette, typography, tone of voice and applications. A system to keep the brand consistent across every touchpoint.",
    ebat_social_title: "Social Media",

    // Metadata
    meta_description: "Multidisciplinary designer. Projects in Graphic Design, Web Design, UX/UI and Creative Coding.",
  },
} as const;

export type DictKey = keyof typeof dictionaries.pt;
export default dictionaries;
