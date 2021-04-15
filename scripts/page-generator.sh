pageswithcategory="
back-to-office,cat-be
communication,cat-be
debrief,cat-be
health-declaration,cat-be
non-pass-finalisation,cat-be
office,cat-be
pass-finalisation,cat-be
post-debrief-holding,cat-be
rekey-reason,cat-be
test-report,cat-be
waiting-room,cat-be
waiting-room-to-car,cat-be
"
echo "Create folder structure/pages with categories for DES"
while IFS=, read pagename cat; do
  read -a pages <<< $cat
  for category in "${pages[@]}"
  do
	 ionic g page pages/$pagename/$category/$pagename.$category
  done
done << E
$pageswithcategory
E

