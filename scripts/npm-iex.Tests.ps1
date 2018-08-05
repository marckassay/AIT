Describe 'Test npm-iex.Tests.ps1' {
    BeforeAll {
        $SymlinkDirectoryPath = New-Item -ItemType SymbolicLink -Path '.\ionic.ps1' -Target '.\npm-iex' -Force | `
            Select-Object -ExpandProperty DirectoryName
        $Env:Path += ";" + (Resolve-Path $SymlinkDirectoryPath | Select-Object -ExpandProperty Path)
    }
    
    AfterAll {
        Remove-Item -Path $SymlinkDirectoryPath
        try {
            $StringToBeRemoved = ";$SymlinkDirectoryPath"
            if ($Env:Path.Contains($StringToBeRemoved)) {
                $Env:Path = $Env:Path.Replace($StringToBeRemoved, "")
            }
            else {
                throw
            }
        }
        catch {
            Write-Error -Message "Unable to remove the following from environment PATH: $SymlinkDirectoryPath"
        }
    }

    Context 'Post install of npm-iex' {
        It 'Should have npm-iex in expected folder' {
            Test-Path .\npm-iex | Should -Be $true
        }
    }

    Context 'Launch ionic' {
        It 'Should be able to execute symlink' {
            Invoke-Expression "ionic start my-app"
        }
    }
}
