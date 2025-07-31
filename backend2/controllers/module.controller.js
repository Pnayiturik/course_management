import db  from '../models/index.js';

export const createModule = async (req, res) => {
    try {
        const { code, name, description, credits, is_active } = req.body;
        
        const module = await db.Module.create({
            code,
            name,
            description,
            credits,
            is_active
        });
        
        return res.status(201).json(module);
    } catch (error) {
        console.error(error);
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({ error: error.errors.map(e => e.message) });
        }
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ error: 'Module code must be unique' });
        }
        return res.status(500).json({ error: "Failed to create module" });
    }
};

export const getAllModules = async (req, res) => {
    try {
        const { active } = req.query;
        let where = {};
        
        if (active === 'true') {
            where.is_active = true;
        } else if (active === 'false') {
            where.is_active = false;
        }
        
        const modules = await db.Module.findAll({ where });
        return res.status(200).json(modules);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to fetch modules" });
    }
};

export const getModuleById = async (req, res) => {
    try {
        const { id } = req.params;
        const module = await db.Module.findByPk(id);
        
        if (!module) {
            return res.status(404).json({ error: "Module not found" });
        }
        
        return res.status(200).json(module);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to fetch module" });
    }
};

export const updateModule = async (req, res) => {
    try {
        const { id } = req.params;
        const { code, name, description, credits, is_active } = req.body;
        
        const module = await db.Module.findByPk(id);
        if (!module) {
            return res.status(404).json({ error: "Module not found" });
        }
        
        const updatedModule = await module.update({
            code,
            name,
            description,
            credits,
            is_active
        });
        
        return res.status(200).json(updatedModule);
    } catch (error) {
        console.error(error);
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({ error: error.errors.map(e => e.message) });
        }
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ error: 'Module code must be unique' });
        }
        return res.status(500).json({ error: "Failed to update module" });
    }
};

export const deleteModule = async (req, res) => {
    try {
        const { id } = req.params;
        
        const module = await db.Module.findByPk(id);
        if (!module) {
            return res.status(404).json({ error: "Module not found" });
        }
        
        await module.destroy();
        return res.status(204).send();
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to delete module" });
    }
};