pages=(
journal
dashboard
"back-to-office/cat-a-mod1 --prefix=back-to-office"
back-to-office/cat-a-mod2
back-to-office/cat-adi-part2
back-to-office/cat-b
candidatedetails
communications-page/cat-a-mod1
communications-page/cat-a-mod2
communications-page/cat-adi-part2
)

echo "Create folder structure/pages for DES"

for i in "${pages[@]}"
do
	ng g page pages/$i
done
