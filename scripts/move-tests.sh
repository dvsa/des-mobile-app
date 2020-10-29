
echo "Moving Tests ..."

cd ./src/app

moveTests() {
  if [[ -e "$1/__tests__" ]]; then
    echo "EXISTS $1__tests__"
  else
    echo "CREATING $1/__tests__"
    mkdir $1/__tests__
  fi

  echo "MOVING $1/*.spec.ts to $1/__tests__/"
  mv $1/*.spec.ts $1/__tests__/
}

paths=(`find . -type d`)

files=()

for path in "${paths[@]}"
do
  # check if a folder is __tests__
  if compgen -G "$path/*.spec.ts" > /dev/null; then
    moveTests $path
  fi
done

echo "Moving Tests Completed"

