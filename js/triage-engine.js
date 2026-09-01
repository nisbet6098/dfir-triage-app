class DFIRTriageEngine {
    constructor() {
        this.playbooks = {};
    }

    async loadData() {
        try {
            const response = await fetch('data/playbooks.json');
            this.playbooks = await response.json();
            return true;
        } catch (error) {
            console.error("Failed to load playbooks.json:", error);
            return false;
        }
    }

    getPlaybook(key) {
        return this.playbooks[key] || null;
    }
}
