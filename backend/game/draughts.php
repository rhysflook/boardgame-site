<!doctype html>
<?php session_start();?>
<html lang="en">
<head>
    <meta charset="utf-8">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <meta http-equiv="ScreenOrientation" content="autoRotate:disabled">
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="mobile-web-app-capable" content="yes" />
    <link rel="manifest" href="../../manifest.json" />
    <link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@300&display=swap" rel="stylesheet">
    <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1" />
    <link rel="stylesheet" href="../../menu.css">
    <link rel="stylesheet" href="../../styles.css">
</head>
<body>
    <script>var exports = {};</script>
    <script type="module" src="../../dist/game.bundle.js"></script>
    <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
    <div class="screen gameview-screen">
        <div id="quit"><button class="base-button quit">Back</button></div>
        <div id="left-side">
            <div class="container">
                <div class="board">        
                    
                    <?php for($i=0; $i < 8; $i++ ): ?> 
                        <?php for($j=0; $j < 8; $j++): ?>
                            <?php if ($i % 2 == 1 && $j % 2 == 0 || $i % 2 == 0 && $j % 2 == 1): ?>
                                <div id="<?=$i."-".$j ?>" class="square black">
                                </div>
                            <?php else: ?>
                                <div class="square white"></div>
                            <?php endif; ?>
                        <?php endfor; ?>                   
                    <?php endfor; ?>
                </div>
            </div>
            <div id="scores"></div>
        </div>
        
        <div id="chat-menu"></div>                          
    </div>  
    <script>
        const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register(
        '../../service-worker.js',
        {
          scope: '/draughts/',
        }
      );
      if (registration.installing) {
        console.log('Service worker installing');
      } else if (registration.waiting) {
        console.log('Service worker installed');
      } else if (registration.active) {
        console.log('Service worker active');
      }
    } catch (error) {
      console.error(`Registration failed with ${error}`);
    }
  }
};
registerServiceWorker()
    </script>
</body>
</html>