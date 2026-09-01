document.addEventListener('DOMContentLoaded', async () => {
    const engine = new DFIRTriageEngine();
    await engine.loadData();

    let artifactsData = {};
    let commandsData = {};

    try {
        const [artRes, cmdRes] = await Promise.all([
            fetch('data/artifacts.json'),
            fetch('data/commands.json')
        ]);
        artifactsData = await artRes.json();
        commandsData = await cmdRes.json();
    } catch (e) {
        console.error("Error loading JSON data stores:", e);
    }

    const playbookList = document.getElementById('playbook-list');
    const artifactList = document.getElementById('artifact-list');
    const toolsList = document.getElementById('tools-list');
    const stageTitle = document.getElementById('stage-title');
    const stageDesc = document.getElementById('stage-desc');
    const stepsGrid = document.getElementById('triage-steps');
    const commandContainer = document.getElementById('command-container');
    const searchInput = document.getElementById('global-search');

    function clearActiveState() {
        document.querySelectorAll('.sidebar li').forEach(li => li.classList.remove('active'));
    }

    // Helper: Build copyable terminal command block
    function createCommandBlock(cmdText) {
        const block = document.createElement('div');
        block.style.cssText = `
            background: #000;
            border: 1px solid var(--border-color);
            padding: 0.75rem 1rem;
            border-radius: 4px;
            margin-bottom: 0.5rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 1rem;
        `;

        const code = document.createElement('code');
        code.style.cssText = `
            font-family: var(--font-mono);
            font-size: 0.85rem;
            color: var(--accent-green);
            word-break: break-all;
        `;
        code.textContent = cmdText;

        const copyBtn = document.createElement('button');
        copyBtn.textContent = 'Copy';
        copyBtn.style.cssText = `
            background: var(--bg-card);
            color: var(--text-main);
            border: 1px solid var(--border-color);
            border-radius: 4px;
            padding: 0.25rem 0.6rem;
            font-size: 0.75rem;
            cursor: pointer;
            transition: all 0.2s;
            white-space: nowrap;
        `;

        copyBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(cmdText);
            copyBtn.textContent = 'Copied!';
            copyBtn.style.borderColor = 'var(--accent-green)';
            copyBtn.style.color = 'var(--accent-green)';
            setTimeout(() => {
                copyBtn.textContent = 'Copy';
                copyBtn.style.borderColor = 'var(--border-color)';
                copyBtn.style.color = 'var(--text-main)';
            }, 2000);
        });

        block.appendChild(code);
        block.appendChild(copyBtn);
        return block;
    }

    // Render Playbook Module
    function renderPlaybook(key) {
        const playbook = engine.getPlaybook(key);
        if (!playbook) return;

        stageTitle.textContent = playbook.title;
        stageDesc.textContent = playbook.description;
        stepsGrid.innerHTML = '';
        commandContainer.innerHTML = '<p class="placeholder-text">Select a step card above to populate field-ready execution commands.</p>';

        playbook.steps.forEach((step) => {
            const card = document.createElement('div');
            card.className = 'step-card';
            card.style.cssText = `
                background: var(--bg-card);
                border: 1px solid var(--border-color);
                border-radius: 6px;
                padding: 1rem;
                cursor: pointer;
                transition: border-color 0.2s;
            `;
            card.innerHTML = `
                <h4 style="color: var(--accent-blue); margin-bottom: 0.5rem;">${step.title}</h4>
                <p style="font-size: 0.875rem; color: var(--text-main);">${step.action}</p>
            `;

            card.addEventListener('click', () => {
                document.querySelectorAll('.step-card').forEach(c => c.style.borderColor = 'var(--border-color)');
                card.style.borderColor = 'var(--accent-green)';
                
                commandContainer.innerHTML = '';
                step.commands.forEach(cmd => {
                    commandContainer.appendChild(createCommandBlock(cmd));
                });
            });

            stepsGrid.appendChild(card);
        });
    }

    // Render Artifacts Module
    function renderArtifacts(targetOS) {
        const data = artifactsData[targetOS];
        if (!data) return;

        stageTitle.textContent = data.title;
        stageDesc.textContent = "Forensic paths, registry keys, and log locations for artifact extraction.";
        stepsGrid.innerHTML = '';
        commandContainer.innerHTML = '<p class="placeholder-text">Click an artifact card above to view details.</p>';

        data.categories.forEach(cat => {
            cat.items.forEach(item => {
                const card = document.createElement('div');
                card.className = 'step-card';
                card.style.cssText = `
                    background: var(--bg-card);
                    border: 1px solid var(--border-color);
                    border-radius: 6px;
                    padding: 1rem;
                    cursor: pointer;
                `;
                card.innerHTML = `
                    <span style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">${cat.name}</span>
                    <h4 style="color: var(--accent-blue); margin: 0.25rem 0;">${item.name}</h4>
                    <p style="font-size: 0.85rem; color: var(--text-main); font-family: var(--font-mono);">${item.path}</p>
                `;

                card.addEventListener('click', () => {
                    document.querySelectorAll('.step-card').forEach(c => c.style.borderColor = 'var(--border-color)');
                    card.style.borderColor = 'var(--accent-green)';

                    commandContainer.innerHTML = '';
                    const detailBox = document.createElement('div');
                    detailBox.style.cssText = `background: #000; border: 1px solid var(--border-color); padding: 1rem; border-radius: 4px;`;
                    detailBox.innerHTML = `
                        <h4 style="color: var(--accent-green); margin-bottom: 0.5rem;">${item.name}</h4>
                        <p style="color: var(--text-main); font-size: 0.9rem; margin-bottom: 0.75rem;">${item.desc}</p>
                    `;
                    detailBox.appendChild(createCommandBlock(item.path));
                    commandContainer.appendChild(detailBox);
                });

                stepsGrid.appendChild(card);
            });
        });
    }

    // Render Tools Module
    function renderTools(toolKey) {
        const tool = commandsData[toolKey];
        if (!tool) return;

        stageTitle.textContent = tool.title;
        stageDesc.textContent = "Specialized CLI commands and quick reference recipes for triage analysis.";
        stepsGrid.innerHTML = '';
        commandContainer.innerHTML = '<p class="placeholder-text">Select a command card above to view execution details.</p>';

        tool.commands.forEach(item => {
            const card = document.createElement('div');
            card.className = 'step-card';
            card.style.cssText = `
                background: var(--bg-card);
                border: 1px solid var(--border-color);
                border-radius: 6px;
                padding: 1rem;
                cursor: pointer;
            `;
            card.innerHTML = `
                <h4 style="color: var(--accent-blue); margin-bottom: 0.5rem;">${item.name}</h4>
                <p style="font-size: 0.85rem; color: var(--text-main); font-family: var(--font-mono); word-break: break-all;">${item.cmd}</p>
            `;

            card.addEventListener('click', () => {
                document.querySelectorAll('.step-card').forEach(c => c.style.borderColor = 'var(--border-color)');
                card.style.borderColor = 'var(--accent-green)';

                commandContainer.innerHTML = '';
                const detailBox = document.createElement('div');
                detailBox.style.cssText = `background: #000; border: 1px solid var(--border-color); padding: 1rem; border-radius: 4px;`;
                detailBox.innerHTML = `
                    <h4 style="color: var(--accent-green); margin-bottom: 0.5rem;">${item.name}</h4>
                    <p style="color: var(--text-main); font-size: 0.9rem; margin-bottom: 0.75rem;">${item.desc}</p>
                `;
                detailBox.appendChild(createCommandBlock(item.cmd));
                commandContainer.appendChild(detailBox);
            });

            stepsGrid.appendChild(card);
        });
    }

    // Live Instant Filter
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            const cards = document.querySelectorAll('.step-card');

            cards.forEach(card => {
                const text = card.textContent.toLowerCase();
                if (text.includes(query)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }

    // Event Listeners for Sidebar
    playbookList.querySelectorAll('li').forEach(item => {
        item.addEventListener('click', (e) => {
            clearActiveState();
            e.target.classList.add('active');
            renderPlaybook(e.target.dataset.playbook);
        });
    });

    artifactList.querySelectorAll('li').forEach(item => {
        item.addEventListener('click', (e) => {
            clearActiveState();
            e.target.classList.add('active');
            renderArtifacts(e.target.dataset.target);
        });
    });

    if (toolsList) {
        toolsList.querySelectorAll('li').forEach(item => {
            item.addEventListener('click', (e) => {
                clearActiveState();
                e.target.classList.add('active');
                renderTools(e.target.dataset.tool);
            });
        });
    }

    // Initial Default Load
    renderPlaybook('ransomware');
});
