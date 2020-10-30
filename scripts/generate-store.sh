#!/bin/bash

echo "Generate Store ..."

ng generate store State --root --statePath store -m app.module.ts

stateSlices=(
  app-info
  journal
  logs
  tests
)

for stateSlice in "${stateSlices[@]}"
do
  echo "Generating store/${stateSlice} ..."

  ng generate action store/$stateSlice/$stateSlice --api false --creators true --skipTests true
  ng generate reducer store/$stateSlice/$stateSlice --reducers ../index.ts --api false --creators true
  ng generate selector store/$stateSlice/$stateSlice
  ng generate effect store/$stateSlice/$stateSlice --root -m app.module.ts --creators true --api false
done

categories=(
  cat-a-mod1
  cat-a-mod2
  cat-adi-part2
  cat-b
  cat-be
  cat-c
  cat-c1
  cat-c1e
  cat-ce
  cat-cpc
  cat-d
  cat-d1
  cat-d1e
  cat-de
  cat-f
  cat-g
  cat-h
  cat-k
)


echo "Generating high level reducers ..."

for category in "${categories[@]}"
do 
  ng generate reducer store/tests/tests.$category --api false --creators false --skipTests true
done


testResultProperties="accompaniment,cat-cpc
activity-code
category
change-marker
communication-preferences
delegated-test
examiner-booked
examiner-conducted
examiner-keyed
instructor-details
journal-data,cat-a-mod1 cat-a-mod2 cat-adi-part2 cat-b cat-be cat-c cat-cpc cat-d cat-home
pass-completion,cat-a-mod1 cat-c cat-cpc cat-d
post-test-declarations
pre-test-declarations,cat-a-mod1 cat-a-mod2
rekey
rekey-date
rekey-reason
schema-version
test-data,cat-a-mod1 cat-a-mod2 cat-adi-part2 cat-b cat-be cat-c cat-cpc cat-d cat-home
test-status
test-summary,cat-a-mod1 cat-a-mod2 cat-cpc
trainer-details
vehicle-details,cat-a-mod1 cat-a-mod2 cat-adi-part2 cat-b cat-be cat-c cat-cpc cat-d"
while IFS=, read property cat; do
  read -a properties <<< $cat

  if [ ${#properties[@]} -eq 0 ]; then
    echo "Generating simple tests state properties ..."

    ng generate action store/tests/$property/$property --api false --creators true --skipTests true
    ng generate reducer store/tests/$property/$property --api false --creators true
    ng generate selector store/tests/$property/$property
    continue
  fi

  # Generating complex 

  if [ "$property" = "journal-data" ]; then 
    echo "Generating journal-data high level reducers ..."

    for category in "${properties[@]}"
    do
      ng generate reducer store/tests/$property/$category/$property.$category --api false --creators true --skipTests true
    done

    continue
  fi

  if [ "$property" = "test-data" ]; then
    echo "Generating test-data high level reducers & selectors ..."

    for category in "${properties[@]}"
    do
      ng generate reducer store/tests/$property/$category/$property.$category --api false --creators true --skipTests true
      ng generate selector store/tests/$property/$category/$property.$category
    done

    continue
  fi

  ng generate action store/tests/$property/common/$property --api false --creators true --skipTests true
  ng generate reducer store/tests/$property/common/$property --api false --creators true
  ng generate selector store/tests/$property/common/$property

  for category in "${properties[@]}"
  do

    echo "$property - $category"

    ng generate action store/tests/$property/$category/$property.$category --api false --creators true --skipTests true
    ng generate reducer store/tests/$property/$category/$property.$category --api false --creators true
    ng generate selector store/tests/$property/$category/$property.$category

  done
done << E
$testResultProperties
E

echo "Generating journal-data properties ..."

journalDataProperties=(
  application-reference
  candidate
  examiner
  test-centre
  test-slot-attributes
)

for journalDataProperty in "${journalDataProperties[@]}"
do
  echo "Generating store/tests/journal-data/common/${journalDataProperty} ..."

  ng generate action store/tests/journal-data/common/$journalDataProperty/$journalDataProperty --api false --creators true --skipTests true
  ng generate reducer store/tests/journal-data/common/$journalDataProperty/$journalDataProperty --api false --creators true
  ng generate selector store/tests/journal-data/common/$journalDataProperty/$journalDataProperty

  if [ "$journalDataProperty" = "candidate" ]; then
    categoriesThatHaveCandidate=(cat-be cat-c cat-d cat-home)
    for category in "${categoriesThatHaveCandidate[@]}"
    do
      ng generate action store/tests/journal-data/$category/$journalDataProperty/$journalDataProperty.$category --api false --creators true --skipTests true
      ng generate reducer store/tests/journal-data/$category/$journalDataProperty/$journalDataProperty.$category --api false --creators true
    done
  fi
done

echo "Generating test-data properties ..."

testDataProperties=(
  controlled-stop
  dangerous-faults
  driving-faults
  eco
  eta
  eyesight-test
  highway-code-safety
  manoeuvres
  serious-faults
  single-fault-competencies
  test-requirements
  uncouple-recouple
)

for testDataProperty in "${testDataProperties[@]}"
do
  echo "Generating store/tests/test-data/common/${testDataProperty} ..."

  ng generate action store/tests/test-data/common/$testDataProperty/$testDataProperty --api false --creators true --skipTests true
  ng generate reducer store/tests/test-data/common/$testDataProperty/$testDataProperty --api false --creators true
  ng generate selector store/tests/test-data/common/$testDataProperty/$testDataProperty
done

echo "Generating store/tests/test-data/cat-a-mod1/ ..."

ng generate action store/tests/test-data/cat-a-mod1/avoidance/avoidance --api false --creators true --skipTests true
ng generate reducer store/tests/test-data/cat-a-mod1/avoidance/avoidance --api false --creators true
ng generate selector store/tests/test-data/cat-a-mod1/avoidance/avoidance

ng generate action store/tests/test-data/cat-a-mod1/emergency-stop/emergency-stop --api false --creators true --skipTests true
ng generate reducer store/tests/test-data/cat-a-mod1/emergency-stop/emergency-stop --api false --creators true
ng generate selector store/tests/test-data/cat-a-mod1/emergency-stop/emergency-stop

echo "Generating store/tests/test-data/cat-a-mod2/ ..."

ng generate action store/tests/test-data/cat-a-mod2/safety-and-balance/safety-and-balance --api false --creators true --skipTests true
ng generate reducer store/tests/test-data/cat-a-mod2/safety-and-balance/safety-and-balance --api false --creators true
ng generate selector store/tests/test-data/cat-a-mod2/safety-and-balance/safety-and-balance

ng generate action store/tests/test-data/cat-a-mod2/test-requirements/test-requirements --api false --creators true --skipTests true
ng generate reducer store/tests/test-data/cat-a-mod2/test-requirements/test-requirements --api false --creators true
ng generate selector store/tests/test-data/cat-a-mod2/test-requirements/test-requirements

echo "Generating store/tests/test-data/cat-adi-part2/ ..."

ng generate action store/tests/test-data/cat-adi-part2/manoeuvres/manoeuvres --api false --creators true --skipTests true
ng generate reducer store/tests/test-data/cat-adi-part2/manoeuvres/manoeuvres --api false --creators true
ng generate selector store/tests/test-data/cat-adi-part2/manoeuvres/manoeuvres

ng generate action store/tests/test-data/cat-adi-part2/test-requirements/test-requirements --api false --creators true --skipTests true
ng generate reducer store/tests/test-data/cat-adi-part2/test-requirements/test-requirements --api false --creators true
ng generate selector store/tests/test-data/cat-adi-part2/test-requirements/test-requirements

ng generate action store/tests/test-data/cat-adi-part2/vehicle-checks/vehicle-checks --api false --creators true --skipTests true
ng generate reducer store/tests/test-data/cat-adi-part2/vehicle-checks/vehicle-checks --api false --creators true
ng generate selector store/tests/test-data/cat-adi-part2/vehicle-checks/vehicle-checks

echo "Generating store/tests/test-data/cat-b/ ..."

ng generate action store/tests/test-data/cat-b/manoeuvres/manoeuvres --api false --creators true --skipTests true
ng generate reducer store/tests/test-data/cat-b/manoeuvres/manoeuvres --api false --creators true
ng generate selector store/tests/test-data/cat-b/manoeuvres/manoeuvres

ng generate action store/tests/test-data/cat-b/test-requirements/test-requirements --api false --creators true --skipTests true
ng generate reducer store/tests/test-data/cat-b/test-requirements/test-requirements --api false --creators true
ng generate selector store/tests/test-data/cat-b/test-requirements/test-requirements

ng generate action store/tests/test-data/cat-b/vehicle-checks/vehicle-checks --api false --creators true --skipTests true
ng generate reducer store/tests/test-data/cat-b/vehicle-checks/vehicle-checks --api false --creators true
ng generate selector store/tests/test-data/cat-b/vehicle-checks/vehicle-checks

echo "Generating store/tests/test-data/cat-be/ ..."

ng generate action store/tests/test-data/cat-be/test-requirements/test-requirements --api false --creators true --skipTests true
ng generate reducer store/tests/test-data/cat-be/test-requirements/test-requirements --api false --creators true
ng generate selector store/tests/test-data/cat-be/test-requirements/test-requirements

ng generate action store/tests/test-data/cat-be/vehicle-checks/vehicle-checks --api false --creators true --skipTests true
ng generate reducer store/tests/test-data/cat-be/vehicle-checks/vehicle-checks --api false --creators true
ng generate selector store/tests/test-data/cat-be/vehicle-checks/vehicle-checks

echo "Generating store/tests/test-data/cat-c/ ..."

ng generate action store/tests/test-data/cat-c/test-requirements/test-requirements --api false --creators true --skipTests true
ng generate reducer store/tests/test-data/cat-c/test-requirements/test-requirements --api false --creators true
ng generate selector store/tests/test-data/cat-c/test-requirements/test-requirements

ng generate action store/tests/test-data/cat-c/vehicle-checks/vehicle-checks --api false --creators true --skipTests true
ng generate reducer store/tests/test-data/cat-c/vehicle-checks/vehicle-checks --api false --creators true
ng generate selector store/tests/test-data/cat-c/vehicle-checks/vehicle-checks

echo "Generating store/tests/test-data/cat-cpc/ ..."

ng generate action store/tests/test-data/cat-cpc/combination/combination --api false --creators true --skipTests true
ng generate reducer store/tests/test-data/cat-cpc/combination/combination --api false --creators true
ng generate selector store/tests/test-data/cat-cpc/combination/combination

ng generate action store/tests/test-data/cat-cpc/overall-score/overall-score --api false --creators true --skipTests true
ng generate reducer store/tests/test-data/cat-cpc/overall-score/overall-score --api false --creators true
ng generate selector store/tests/test-data/cat-cpc/overall-score/overall-score

ng generate action store/tests/test-data/cat-cpc/questions/questions --api false --creators true --skipTests true
ng generate reducer store/tests/test-data/cat-cpc/questions/questions --api false --creators true
ng generate selector store/tests/test-data/cat-cpc/questions/questions

echo "Generate store/tests/test-data/cat-d/ ..."

ng generate action store/tests/test-data/cat-d/pcv-door-exercise/pcv-door-exercise --api false --creators true --skipTests true
ng generate reducer store/tests/test-data/cat-d/pcv-door-exercise/pcv-door-exercise --api false --creators true
ng generate selector store/tests/test-data/cat-d/pcv-door-exercise/pcv-door-exercise

ng generate action store/tests/test-data/cat-d/safety-questions/safety-questions --api false --creators true --skipTests true
ng generate reducer store/tests/test-data/cat-d/safety-questions/safety-questions --api false --creators true
ng generate selector store/tests/test-data/cat-d/safety-questions/safety-questions

ng generate action store/tests/test-data/cat-d/test-requirements/test-requirements --api false --creators true --skipTests true
ng generate reducer store/tests/test-data/cat-d/test-requirements/test-requirements --api false --creators true
ng generate selector store/tests/test-data/cat-d/test-requirements/test-requirements

ng generate action store/tests/test-data/cat-d/vehicle-checks/vehicle-checks --api false --creators true --skipTests true
ng generate reducer store/tests/test-data/cat-d/vehicle-checks/vehicle-checks --api false --creators true
ng generate selector store/tests/test-data/cat-d/vehicle-checks/vehicle-checks

echo "Generating store/tests/test-data/cat-home/ ..."

ng generate action store/tests/test-data/cat-home/test-requirements/test-requirements --api false --creators true --skipTests true
ng generate reducer store/tests/test-data/cat-home/test-requirements/test-requirements --api false --creators true
ng generate selector store/tests/test-data/cat-home/test-requirements/test-requirements

ng generate action store/tests/test-data/cat-home/vehicle-checks/vehicle-checks --api false --creators true --skipTests true
ng generate reducer store/tests/test-data/cat-home/vehicle-checks/vehicle-checks --api false --creators true
ng generate selector store/tests/test-data/cat-home/vehicle-checks/vehicle-checks
