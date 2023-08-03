# -------------
# aws sdk python
# -------------

# install
    # pip install boto3

# -------------
# s3
# -------------

import boto3

client = boto3.client('s3')

# create bucket
    # returns dictionary -- { 'Location', 'location' }
    # ACL options -- private, public-read, public-read-write, authenticated-read
    # bucket constraints -- unique, only lower-case/dashes/numbers
    # additional params -- GrantFullControl, GrantRead, GrantReadACP, GrantWrite, GrantWriteACP, ObjectLockEnabledForBucket
response = client.create_bucket(
    # ACL = 'private',
    Bucket = 'my-unique-bucket-name',
    CreateBucketConfiguration = {
        'LocationConstraint': 'us-east-1'
    },
)

# check exists bucket
response = client.head_bucket(
    Bucket='string'
)

# delete bucket
response = client.delete_bucket(
    Bucket='my-unique-bucket-name'
)

# list buckets
    # returns dictionary -- { 'Buckets' : [ { 'Name' : 'my-unique-bucket-name' } ] }
response = client.list_buckets()

# upload file
s3 = boto.resource('s3')
s3.meta.client.upload_file(
    Filename='./files/filename1.jpg',
    Bucket='my-unique-bucket-name'
    Key='filename1.jpg'
)

# upload file object
s3 = boto3.client('s3')
with open('filename1.jpg', 'rb') as data:
    s3.upload_fileobj(
        Fileobj=data,
        Bucket='my-unique-bucket-name',
        Key='filename1.jpg'
    )


# get object
response = client.get_object(
    Bucket='my-unique-bucket-name',
    Key='filename1.jpg'
)

# check object exists
response = client.head_object(
    Bucket='my-unique-bucket-name',
    Key='filename1.jpg'
)

# delete object
    # returns dict -- { 'DeleteMarker': True, VersionId': 'version_id', 'RequestCharged': 'requester' }
response = client.delete_object(
    Bucket='my-unique-bucket-name',
    Key='filename1.jpg'
)

# delete objects (up to 1000 objects)
    # 'VersionId' can be specified to delete specific versions
    # returns dictionary -- { 'Deleted': [{ 'Key' : 'filename1.jpg' , Deletemarker: 'True' }]}
response = client.delete_objects(
    Bucket='my-unique-bucket-name',
    Delete={
        'Objects': [
            { 'Key': 'filename1.jpg' }
        ]
    }
)

# list objects
    # 'MaxKeys' can be used to limit response size
    # 'Prefix' can be used to limit results
response = client.list_objects(
    Bucket='my-unique-bucket-name',
)


# -------------
#
# -------------



# -------------
#
# -------------



# -------------
#
# -------------



# -------------
#
# -------------



# -------------
#
# -------------



# -------------
#
# -------------



# -------------
#
# -------------



# -------------
#
# -------------



# -------------
#
# -------------



# -------------
#
# -------------



# -------------
#
# -------------



# -------------
#
# -------------



# -------------
#
# -------------



# -------------
#
# -------------



# -------------
#
# -------------



# -------------
#
# -------------



# -------------
#
# -------------



# -------------
#
# -------------



# -------------
#
# -------------



# -------------
#
# -------------



# -------------
#
# -------------



# -------------
#
# -------------



# -------------
#
# -------------



# -------------
#
# -------------



# -------------
#
# -------------



