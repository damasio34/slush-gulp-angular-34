@ECHO off

ECHO ---------------------------------------------------------
ECHO -               Commit master to origin                 -
ECHO ---------------------------------------------------------

git config color.ui true
git config format.pretty oneline

ECHO ------------------- add all changes ---------------------

git add --all
git status

ECHO ------------------------ commit --------------------------

ECHO Informe o comentario do commit
SET /P commit_coments=

git commit -m %commit_coments%
git status

ECHO ------------------------- push ---------------------------

git push origin master
git status

PAUSE >nul