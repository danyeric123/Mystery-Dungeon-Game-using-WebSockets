var Credits = {        
    show: function() {
        bootbox.dialog({
            message: '<p>Game Name is currently in an alpha and the story is not yet finished, if you see any bugs or mistakes then please file an issue. <strong>Version: 1.0 Alpha</strong></p><br><strong>Programming by:</strong> Thomas Erbe<br><strong>Graphics by:</strong> Thomas Erbe<br><strong>Story by:</strong> Marc Grafton & Thomas Erbe.<br><strong>Guinea Pig:</strong> Quinn Butt',
            title: "Credits",
            buttons: {
                main: {
                    label: "Close",
                    className: "btn-primary"
               }
            }
        });
    }    
}