image = open ("/home/theo/Documents/FAC/Master2/Semestre9/BiologieStructurale/Projet/dev/HoughTransformJS/images/circle.txt",'r')
line = image.readline()
imglist=[]
while line!='':
    line = line.strip()
    line = line.replace("\t",",")
    line = line.replace(" ",",")
    imglist.append(line)
    line=image.readline()

image.close()
final = open("/home/theo/Documents/FAC/Master2/Semestre9/BiologieStructurale/Projet/dev/HoughTransformJS/images/houghfinal.txt",'w')
for i in range(len(imglist)):
    final.write(imglist[i])
    final.write(",\n")
final.close()

print imglist
