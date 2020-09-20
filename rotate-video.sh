
# ------------
# rotate
# ------------

# best
ffmpeg -i input.mp4 -metadata:s:v rotate="-90" -codec copy output.mp4

# slow (re-encodes?)
ffmpeg -i input.mp4 -vf "rotate=PI/2" output.mp4

# ------------
# ffmpeg batch (rotate)
# ------------

mkdir -p converted
for i in *; # all files, not directories
  do 
  # name=`echo "$i" | cut -d'.' -f1`
  # output=`./converted/${i}`
  if [[ -f "$i" ]]; then
    echo "$i"
    ffmpeg -i "$i" -metadata:s:v rotate="0" -codec copy "converted/$i"
  fi
done