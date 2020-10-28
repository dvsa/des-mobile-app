pages=(
journal
dashboard
back-to-office/cat-a-mod1
back-to-office/cat-a-mod2
back-to-office/cat-adi-part2
back-to-office/cat-b
back-to-office/cat-b
candidatedetails
communications-page/cat-a-mod1
communications-page/cat-a-mod2
)

for i in "${pages[@]}"
do
	ionic g page pages/$i
done
