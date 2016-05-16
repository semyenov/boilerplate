#!/bin/sh
# This is some secure program that uses security.
COMMAND=$1
NAME=$2

#Blocks
if [ "$COMMAND" == "cb" ]; then
  touch ./src/partials/$2.html
  touch ./src/assets/scss/blocks/_$2.scss
  sed -e "s/\${name}/$2/" ./src/partials/block.template >> ./src/partials/$2.html
  sed -e "s/\${name}/$2/" ./src/assets/scss/blocks/block.template >> ./src/assets/scss/blocks/_$2.scss
  echo "@import \"$2\";" >> ./src/assets/scss/blocks/_all.scss
  echo "Block \"$2\" created!"
elif [ "$COMMAND" == "rb" ]; then
  rm ./src/partials/$2.html
  rm ./src/assets/scss/blocks/_$2.scss
  sed -i "/@import \"$2\";/d" ./src/assets/scss/blocks/_all.scss
  echo "Block \"$2\" removed!"
fi

#Components
if [ "$COMMAND" == "cc" ]; then
  touch ./src/assets/scss/components/_$2.scss
  sed -e "s/\${name}/$2/" ./src/assets/scss/components/component.template >> ./src/assets/scss/components/_$2.scss

  echo "@import \"$2\";" >> ./src/assets/scss/components/_all.scss
  echo "Component \"$2\" created!"
elif [ "$COMMAND" == "rc" ]; then
  rm ./src/scss/partials/components/_$2.scss
  sed -i "/@import \"$2\";/d" ./src/assets/scss/components/_all.scss
  echo "Component \"$2\" removed!"
fi

#Pages
if [ "$COMMAND" == "cp" ]; then
  touch ./src/pages/$2.html
  sed -e "s/\${name}/$2/" ./src/pages/page.template >> ./src/pages/$2.html
  echo "Page \"$2\" created!"
elif [ "$COMMAND" == "rp" ]; then
  rm ./src/pages/$2.html
  echo "Page \"$2\" removed!"
fi
ркддщ
