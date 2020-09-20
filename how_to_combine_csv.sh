# combine csvs (leaves most column headers)
sed 1d *.csv > combined.csv

# combine csvs (remove all headers)
for filename in $(ls piles*.csv); do sed 1d $filename >> combined.csv;  done


