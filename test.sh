array=(
journal
dashboard
)

for i in "${array[@]}"
do
	ionic g page pages/$i --dry-run
	wait
done
