import hashlib


hasher = hashlib.sha256()

with open('Hash of content.txt', 'rb') as afile:
	buf = afile.read()
	hasher.update(buf)
print (hasher.hexdigest())