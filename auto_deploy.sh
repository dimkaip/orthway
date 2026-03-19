#!/bin/bash

# Πήγαινε στον φάκελο του project (άλλαξε τη διαδρομή με τη δική σου)
cd /home/user/projects/orthway

# Έλεγχος αν υπάρχουν αλλαγές
if [[ -n $(git status -s) ]]; then
  git add .
  git commit -m "Auto-update: $(date +'%Y-%m-%d %H:%M:%S')"
  git push origin master  # ή main
  echo "Ανέβηκε επιτυχώς στις $(date)" >> deploy_log.txt
else
  echo "Καμία αλλαγή στις $(date)" >> deploy_log.txt
fi
