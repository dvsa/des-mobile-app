pageswithcategory="
back-to-office,cat-a-mod1 cat-a-mod2 cat-adi-part2 cat-b cat-be cat-c cat-cpc cat-d cat-home-test
communications-page,cat-a-mod1 cat-a-mod2 cat-adi-part2 cat-b cat-be cat-c cat-cpc cat-d cat-home-test
debrief,cat-a-mod1 cat-a-mod2 cat-adi-part2 cat-b cat-be cat-c cat-cpc cat-d cat-home-test
health-declaration,cat-a-mod1 cat-a-mod2 cat-b cat-be cat-c cat-cpc cat-d cat-home-test
non-pass-finalisation,cat-a-mod1 cat-a-mod2 cat-adi-part2 cat-b cat-be cat-c cat-cpc cat-d cat-home-test
office,cat-a-mod1 cat-a-mod2 cat-adi-part2 cat-b cat-be cat-c cat-cpc cat-d cat-home-test
pass-finalisation,cat-a-mod1 cat-a-mod2 cat-adi-part2 cat-b cat-be cat-c cat-cpc cat-d cat-home-test
post-debrief-holding,cat-a-mod1 cat-a-mod2 cat-adi-part2 cat-b cat-be cat-c cat-cpc cat-d cat-home-test
rekey-reason,cat-a-mod1 cat-a-mod2 cat-adi-part2 cat-b cat-be cat-c cat-cpc cat-d cat-home-test
rekey-search,cat-a-mod1 cat-a-mod2 cat-adi-part2 cat-b cat-be cat-c cat-cpc cat-d cat-home-test
test-report,cat-a-mod1 cat-a-mod2 cat-adi-part2 cat-b cat-be cat-c cat-cpc cat-d cat-home-test
view-test-result,cat-a-mod1 cat-a-mod2 cat-adi-part2 cat-b cat-be cat-c cat-cpc cat-d cat-home-test
waiting-room,cat-a-mod1 cat-a-mod2 cat-adi-part2 cat-b cat-be cat-c cat-cpc cat-d cat-home-test
waiting-room-to-car,cat-a-mod1 cat-a-mod2 cat-adi-part2 cat-b cat-be cat-c cat-cpc cat-d cat-home-test
"

pageswithoutcategories=(
candidatedetails
dashboard
delegated-rekey-search
delegated-rekey-upload-outcome
error-page
fake-candidate-details
fake-journal
journal
login
rekey-search
rekey-upload-outcome
test-results-search
)

echo "Create folder structure/pages with categories for DES"
while IFS=, read pagename cat; do
  read -a pages <<< $cat
  for category in "${pages[@]}"
  do
	 ionic g page pages/$pagename/$pagename-$category --selector=$pagename-$category-page --dry-run
  done
done << E
$pageswithcategory
E

echo "Create folder structure/pages without categories for DES TBC"
for pages in "${pageswithoutcategories[@]}"
do
	ionic g page pages/$pages --selector=$pages --dry-run
done
