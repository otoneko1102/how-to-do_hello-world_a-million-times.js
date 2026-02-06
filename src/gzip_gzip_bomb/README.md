100万回のHello, World!はエントロピーが皆無なので、圧縮すれば塵になります

というわけで適当にgzipにかけてみたところ……
```bash
~ $ yes 'Hello, World!' | head -n 1000000 | gzip -9 | base64 | wc -c
36746
```
全然でかい
で、中身をちょっと見てみると……
```
~ $ yes 'Hello, World!' | head -n 1000000 | gzip -9 | base64 | tail
mZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZ
mZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZ
mZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZ
mZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZ
mZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZ
mZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZ
mZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZ
mZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZ
mZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZ
mdlgAT6FC9CAn9UA
```
あれ、まだまだ圧縮が足りてなさそう
ということで二度漬けしてみた
```
~ $ yes 'Hello, World!' | head -n 1000000 | gzip -9 | gzip -9 | base64 | wc -c
219
~ $ yes 'Hello, World!' | head -n 1000000 | gzip -9 | gzip -9 | base64
H4sIAAAAAAACA+3cPQpBAQAA4IfSKz+DsqAo2cnuAk5ge4PBBUwKi8kFWFgcQNlls1okFhcwvFmJ
nELq+w7yVedh8JVMPY6tXFDLBttqMa73883DvtGNJ9HmVeqdR6vx8BK2AQAAAAAAAAAAAAAAAAAA
gF/Z3ceVwvcICJ/vWzk9WCwBAAAAAAAAAAAA+DPXKNGZZU7T9Tn4APdK+vhBagAA
~ $ 
```
いいね！
