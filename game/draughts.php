<!doctype html>

<html lang="en">
    <head>
        <meta charset="utf-8">
        <link rel="stylesheet" href="styles.css">
    </head>
    <body>
        <div class="screen">
        <div class="container">
            <div class="board">
            <?php for($i=0; $i < 8; $i++ ): ?> 
                    <?php for($j=0; $j < 8; $j++): ?>
                        <?php if ($i % 2 == 1 && $j % 2 == 0 || $i % 2 == 0 && $j % 2 == 1): ?>
                        <div id="<?=$i."-".$j ?>" class="square black">

                        </div>
                        <?php else: ?>
                            <div class="square white">

                            </div>
                        <?php endif; ?>
                    <?php endfor; ?>
                
            <?php endfor; ?>
            </div>
        </div>
        <div class="menu">

            
            <div class="chat-box">
                <div class="messages"></div>
                    <textarea></textarea>
                    <button>-></button>
            </div>
        </div>
        
        </div>
        <script type="module" src="index.js"></script>
        <script type="module" src="draughts.js"></script>
        <script type="module" src="Draughts.js"></script>
        <script type="module" src="utils.js"></script>
        <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
    </body>
</html>