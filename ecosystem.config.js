module.exports = {
  apps: [
    {
      name: 'myapp',
      script: './server.js',
      instances: 3, // Lancer 3 instances en parallèle
      exec_mode: 'cluster',
      max_memory_restart: '200M', // Utilisation maximale de la mémoire: 200 Mo
      error_file: './logs/err.log', // Fichier log en cas d’erreur
      out_file: './logs/out.log',
      log_file: './logs/combined.log',
      time: true
    }
  ]
};
