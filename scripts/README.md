# Install global packages as local
TODO: project path is hard-coded.
TODO: create deploy script that is hooked in by git or posh-git?

The 2 files in this directory, deploy files such as ionic and cordova to be used "globally".
Execute the following for 

    "ionic", "ionic.cmd", "cordova", "cordova.cmd" | `
    ForEach-Object {
        New-Item -ItemType SymbolicLink -Path $("$bin\$_"+".ps1") -Value .\scripts\npm-iex -Force
    };

    "ionic", "ionic.cmd", "cordova", "cordova.cmd" | `
    ForEach-Object {
        New-Item -ItemType SymbolicLink -Path "$bin\$_" -Value .\scripts\npm-exec -Force
    }

And in vscode settings, set the following:
    "cordova.cordovaExecutable": ".\\node_modules\\.bin\\ionic.cmd"