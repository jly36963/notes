# -----------------------
# bash scripting
# -----------------------

# -----------------------
# shebang
# -----------------------

#!/bin/bash

# -----------------------
# variables
# -----------------------

# no spaces (name = 'Landon')
# for interpolation, use double-quotes ("${name}")

# variable
my_var="hello world!"
echo $my_var

# interpolation
name="Landon"
echo "hello there, my name is ${name}"

# length
name="Landon"
echo "${#name}" # 6 (length)

# slice
name="Landon"
echo ${name:4} # on
echo ${name:1:3} # and (index 1, characters 3)
echo ${name: -1} # n

# unset variables
name="Landon"
unset name
echo $name # returns nothing

# -----------------------
# command substitution
# -----------------------

# use output of command in another command
ls -l $(which cd)
# store output in a variable
dir1=$(pwd); echo "${dir1}"

# ------------
# brace expansion
# ------------

# folder created for each month/year combination
mkdir {jan,feb,mar,apr,may,jun,jul,aug,sep,oct,nov,dec}_{2017,2018,2019,2020,2021}
mkdir {jan,feb,mar,apr,may,jun,jul,aug,sep,oct,nov,dec}_{2017..2021}

ls {dir1, dir2, dir3} # ls for each dir
touch {1..3}.txt # create 3 files


# -----------------------
# if
# -----------------------

# [ ] POSIX compliant
# [[ ]] specific to bash

# syntax 1
name="Landon";
if [ $name == 'Landon' ]; then
  echo "Hello Landon!"
elif [ $name == "Kakashi" ]; then
  echo "Hello Kakashi!"
else
  echo "Hello there!"
fi

# syntax 2
name="Yamato"
if [ -v name ] && [ ${#name} != 0 ]
then
  echo "Hi there, ${name}"
else
  echo "Hello there, nice to meet you!"
fi

# syntax 3
if [ -f .bash_profile ]
then echo "You have a .bash_profile. Things are fine."
else echo "Yikes! You have no .bash_profile!"
fi


# -----------------------
# logical operators
# -----------------------

# integer comparison: -eq, -ne, -gt, -ge, -lt, -le
# logical conditions: -a, -o (deprecated in POSIX3)
  # inside [[ ]], use '&&' '||'

# single square bracket
my_num=8
if [ $my_num -gt -5 ] && [ $my_num -lt 5 ]
then
  echo "-5 < num < 5"
else
  echo "abs(num) >= 5"
fi

# double square bracket
my_file=".bash_aliases"
if [[ -e $my_file && -s $my_file && -x $my_file ]]
then
  echo "file exists, is not empty, and is executable"
else
  echo "file either does not exist, is empty, or is not executable"
fi

# -----------------------
# for loop
# -----------------------

# example 1
for n in {1,2,3,4,5}; do
  echo "${n}"
done

# example 2 (brace expansion)
for n in {1..5}{a..c}; do
  echo "${n}" # touch "${n}.txt"
done

# example 3 (break)(regex)
for n in {1,2,3,a,5}; do
  # break loop if not a number
  if [[ "${n}" =~ [0-9]+ ]]
  then
    echo "${n}"
  else
    echo "${n} is not a number"
    break
  fi
done

# example 4 (files)
for f in ./* ; do
  if [ -d $f ]
  then
    echo "${f} (directory)"
  else
    echo "${f} (file)"
  fi
done

# example 5 (files)
for f in ./*.txt ; do
  echo "${f}" # echo all txt files
done

# example 6 (without iterable)
for (( i=0; i<25; i=i+1 )); do
  echo "${i}"
done


# -----------------------
# script with arguments (bash ./add.sh 2 4)
# -----------------------

#!/bin/bash

num1=$1 # argument 1
num2=$2 # argument 2

if [[ "${num1}" =~ [0-9]+ ]] && [[ "${num2}" =~ [0-9]+ ]]
then
  num3=$(($num1 + $num2))
  echo "${num3}"
else
  echo "invalid arguments."
fi

# -----------------------
# script with arguments (source ./up.sh 2 ) (alias up='source ~/up.sh')
# -----------------------

#!/bin/bash

num1=$1 # argument 1
if [[ "${num1}" =~ [0-9]+ ]]
then
  for n in $(seq 1 $num1);
  do
    cd ../
  done
  # echo $(pwd)
else
  echo "invalid argument"
fi

# -----------------------
# calculations
# -----------------------

# default (integers only)
echo $(( 2+3 )) # add
echo $(( 2-3 )) # subtract
echo $(( 2*3 )) # multiply
echo $(( 2/3 )) # division (returns integer, not float)
echo $(( 2**3 )) # exponent (cannot use negative exponent)

# node (e -- evaluate, p -- print string)
node -pe '20 * (2+3) + (5/2) + 2**3'
my_result=$(node -pe '(3+3+2)/2'); echo "${my_result}"

# bc (<<<)
bc <<< "(5+5)*2"
bc <<< "scale=2; (10-2)/5" # get 2 decimal places
bc <<< "2^3"

q1="2*3"
a1=$(bc <<< $q1)
echo "${a1}"



# -----------------------
# MISCELLANEOUS
# -----------------------

# -----------------------
# exit
# -----------------------

# when script is done, exit 0 (success) or exit 1 (failure)

# -----------------------
# subshell
# -----------------------

bash
greeting="hello"
echo $greeting # hello
exit
echo # nothing (it was defined in the subshell)

# source
source my_script.sh # forces the script to run in the current shell

# -----------------------
# type (executable, builtin, alias)
# -----------------------

type cat # cat is /bin/cat
type cd # cd is a shell builtin
type up2 # up is aliased to ...

# -----------------------
# here string (here document)
# -----------------------

# variables don't work well with pipes (pipes get run in subshells)
string1="Hello!"
cat <<< $string1

# -----------------------
#
# -----------------------



# -----------------------
#
# -----------------------



# -----------------------
#
# -----------------------



# -----------------------
#
# -----------------------



# -----------------------
#
# -----------------------



# -----------------------
#
# -----------------------



# -----------------------
#
# -----------------------



# -----------------------
#
# -----------------------








































# end
