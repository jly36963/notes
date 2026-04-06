const AWS = require("aws-sdk");

// Instantiate aws sdk
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

// Check bucket exists
const checkBucketExists = async (bucketName) => {
  const params = {
    Bucket: bucketName,
  };
  return await s3.headBucket(params).promise();

};

// List objects (up to 1000 objects)
// 'MaxKeys' can be used to limit response
const listObjectsFromBucket = async ({ bucket, prefix, delimiter }) => {
  if (!bucket) throw new Error('Bucket must be provided')
  const params = { Bucket: bucket };

  if (prefix) params.Prefix = prefix
  if (delimiter) params.Delimiter = delimiter

  return await s3.listObjects(params).promise();
};

// Upload to bucket
const uploadToBucket = async (data, bucket, key) => {
  if (!(data && bucket && key)) throw new Error('Required upload values missing')
  const params = {
    Body: data,
    Bucket: bucket, // Eg: 'my-unique-bucket-name',
    Key: key, // Eg: 'filename1.jpg'
    ServerSideEncryption: "AES256",
    // StorageClass: "STANDARD_IA"
  };
  return await s3.upload(params).promise();
};

// Check object exists
const checkObjectExists = async (bucket, key) => {
  if (!(bucket && key)) throw new Error('Required headObject values missing')
  const params = {
    Bucket: bucket,
    Key: key,
  };
  return await s3.headObject(params).promise();
};

// Get object and create stream
const getObjectAndCreateStream = async (bucket, key) => {
  if (!(bucket && key)) throw new Error('Required getObject values missing')
  const params = {
    Bucket: bucket,
    Key: key,
  };
  return await s3.getObject(params).createReadStream();

};

// Get object from bucket
const getObjectFromBucket = async (bucket, key) => {
  if (!(bucket && key)) throw new Error('Required getObject values missing')
  const params = {
    Bucket: bucket, 
    Key: key,
  };
  return await s3.getObject(params).promise();
};

// Delete object
const deleteObjectFromBucket = async (bucket, key) => {
  if (!(bucket && key)) throw new Error('Required deleteObject values missing')
  const params = {
    Bucket: bucket,
    Key: key,
  };
  return await s3.deleteObject(params).promise();
};

// Delete objects (up to 1000 objects)
// 'VersionId' can be specified to delete specific versions of a file
const deleteObjectsFromBucket = async (bucket, keys) => {
  keys = keys.map((key) => ({ Key: key }));
  const params = {
    Bucket: bucket, 
    Delete: {
      Objects: keys, // Eg: [{ Key: "filename1.jpg" }, { Key: "filename2.jpg" }, ...]
    },
  };
  return await s3.deleteObjects(params).promise();
};

module.exports = {
  checkBucketExists,
  uploadToBucket,
  checkObjectExists,
  getObjectAndCreateStream,
  getObjectFromBucket,
  deleteObjectFromBucket,
  deleteObjectsFromBucket,
  listObjectsFromBucket,
};
