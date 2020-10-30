
echo "Moving Tests ..."
cd ./src/app

testsDir="__tests__"
fileExt="*.spec.ts"

moveTests() {
  if [[ -e "$1/$testDir" ]]; then
    echo "EXISTS $1/$testsDir"
  else
    echo "CREATING $1/$testsDir"
    mkdir $1/__tests__
  fi

  echo "MOVING $1/$fileExt to $1/$testsDir/"
  mv $1/*.spec.ts $1/__tests__/
}

paths=(`find . -type d`)
files=()

for path in "${paths[@]}"
do
  file=$(basename $path)
  
  if [[ "$file" = "$testsDir" ]]; then
    echo "$testsDir found"
  else
    if compgen -G "$path/$fileExt" > /dev/null; then
      moveTests $path
    fi
  fi
done

echo "Moving Tests Completed"
