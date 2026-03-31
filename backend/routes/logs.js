const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

// Route pour visualiser les logs (protégée par adminAuth au niveau server.js)
router.get('/view', async (req, res) => {
  try {
    const { type = 'app', lines = 100 } = req.query;
    const logsDir = path.join(__dirname, '../logs');
    
    // Valider le type de log
    const allowedTypes = ['app', 'error', 'auth', 'payment', 'requests'];
    if (!allowedTypes.includes(type)) {
      return res.status(400).json({ error: 'Type de log invalide' });
    }
    
    const logFile = path.join(logsDir, `${type}.log`);
    
    // Vérifier si le fichier existe
    try {
      await fs.access(logFile);
    } catch {
      return res.status(404).json({ error: 'Fichier de log non trouvé' });
    }
    
    // Lire les dernières lignes du fichier (Async)
    const data = await fs.readFile(logFile, 'utf8');
    const logLines = data.split('\n').filter(line => line.trim());
    const recentLines = logLines.slice(-parseInt(lines));
    
    // Parser les lignes de log JSON
    const parsedLogs = recentLines.map(line => {
      try {
        return JSON.parse(line);
      } catch {
        return { message: line, timestamp: new Date().toISOString() };
      }
    });
    
    res.json({
      type,
      totalLines: logLines.length,
      logs: parsedLogs.reverse() // Plus récent en premier
    });
    
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la lecture des logs' });
  }
});

// Route pour les statistiques de logs
router.get('/stats', async (req, res) => {
  try {
    const logsDir = path.join(__dirname, '../logs');
    const stats = {};
    
    // Récupérer les statistiques pour chaque type de log
    const logTypes = ['app', 'error', 'auth', 'payment', 'requests'];
    
    // Récupérer les statistiques en parallèle (Async)
    const statsPromises = logTypes.map(async (type) => {
      const logFile = path.join(logsDir, `${type}.log`);
      try {
        const stat = await fs.stat(logFile);
        const data = await fs.readFile(logFile, 'utf8');
        const lines = data.split('\n').filter(line => line.trim());
        
        return [type, {
          size: Math.round(stat.size / 1024), // KB
          lines: lines.length,
          lastModified: stat.mtime
        }];
      } catch {
        return [type, { size: 0, lines: 0, lastModified: null }];
      }
    });

    const results = await Promise.all(statsPromises);
    results.forEach(([type, data]) => { stats[type] = data; });
    
    res.json(stats);
    
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des statistiques' });
  }
});

// Route pour télécharger les logs
router.get('/download/:type', async (req, res) => {
  try {
    const { type } = req.params;
    const allowedTypes = ['app', 'error', 'auth', 'payment', 'requests'];
    
    if (!allowedTypes.includes(type)) {
      return res.status(400).json({ error: 'Type de log invalide' });
    }
    
    const logFile = path.join(__dirname, '../logs', `${type}.log`);
    
    try {
      await fs.access(logFile);
    } catch {
      return res.status(404).json({ error: 'Fichier de log non trouvé' });
    }
    
    // Télécharger le fichier
    res.download(logFile, `tictac-${type}-logs.log`);
    
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors du téléchargement' });
  }
});

// Route pour nettoyer les anciens logs
router.delete('/cleanup', async (req, res) => {
  try {
    const { days = 7 } = req.query;
    const logsDir = path.join(__dirname, '../logs');
    const cutoffDate = new Date(Date.now() - (parseInt(days) * 24 * 60 * 60 * 1000));
    
    let deletedFiles = 0;
    let totalSize = 0;
    
    // Parcourir tous les fichiers de logs (Async)
    const files = await fs.readdir(logsDir);
    
    await Promise.all(files.map(async (file) => {
      if (file.endsWith('.log')) {
        const filePath = path.join(logsDir, file);
        const stat = await fs.stat(filePath);
        
        if (stat.mtime < cutoffDate) {
          const size = stat.size;
          await fs.unlink(filePath);
          deletedFiles++;
          totalSize += size;
        }
      }
    }));
    
    res.json({
      deletedFiles,
      freedSpace: Math.round(totalSize / 1024), // KB
      cutoffDate: cutoffDate.toISOString()
    });
    
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors du nettoyage' });
  }
});

module.exports = router;
