<!doctype html>
<?php session_start();?>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1" />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@300&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="../../styles.css">
</head>
<body>
    <script>var exports = {};</script>
    <script type="module" src="../../dist/game.bundle.js"></script>
    <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
    <div class="screen gameview-screen">
        <div id="left-side">
            <div id="quit"><button class="popup-button">Back</button></div>
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
</body>
</html>