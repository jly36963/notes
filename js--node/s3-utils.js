// imports
const AWS = require("aws-sdk");

// s3 object
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

// check bucket exists
const checkBucketExists = async (bucketName) => {
  const params = {
    Bucket: bucketName,
  };
  try {
    let bucketData = await s3.headBucket(params).promise();
    console.log("s3Utils bucketExists", bucketData);
    return { data: bucketData, error: null };
  } catch (err) {
    console.log(err);
    return { data: null, error: err.message };
  }
};

// list objects
// lists up to 1000 objects. 'MaxKeys' can be used to limit response
const listObjectsFromBucket = async (config) => {
  const params = {};
  if (config.Bucket) {
    params.Bucket = config.Bucket;
  } else {
    return { data: null, error: "Bucket not specified." };
  }
  if (config.Prefix) params.Prefix = config.Prefix;
  if (config.Delimiter) params.Delimiter = config.Delimiter;

  try {
    let objectsData = await s3.listObjects(params).promise();
    // // console.log('s3Utils objectsList', objectsData); // prints metadata for all objects
    return { data: objectsData, error: null };
  } catch (err) {
    console.log(err);
    return { data: null, error: err.message };
  }
};

// upload to bucket
const uploadToBucket = async (data, bucketName, key) => {
  // params
  const params = {
    Body: data,
    Bucket: bucketName, // 'my-unique-bucket-name',
    Key: key, // 'filename1.jpg'
    ServerSideEncryption: "AES256",
    // StorageClass: "STANDARD_IA"
  };
  // s3 request
  try {
    let objectData = await s3.upload(params).promise();
    // // console.log(objectData);
    return { data: objectData, error: null };
  } catch (err) {
    console.log(err);
    return { data: null, error: err.message };
  }
};

// check object exists
const checkObjectExists = async (bucketName, key) => {
  const params = {
    Bucket: bucketName, // 'my-unique-bucket-name',
    Key: key, // 'filename1.jpg'
  };
  try {
    let objectData = await s3.headObject(params).promise();
    // // console.log(objectData.data, objectData.errors); // prints metadata
    return { data: objectData, error: null };
  } catch (err) {
    console.log(err);
    return { data: null, error: err.message };
  }
};

// get object and create Stream
const getObjectAndCreateStream = async (bucketName, key) => {
  try {
    const params = {
      Bucket: bucketName,
      Key: key,
    };
    const stream = await s3.getObject(params).createReadStream();
    return { data: stream, error: null };
  } catch (err) {
    console.log(err);
    return { data: null, error: err.message };
  }
};

// get object from bucket
const getObjectFromBucket = async (bucketName, key) => {
  const params = {
    Bucket: bucketName, // 'my-unique-bucket-name',
    Key: key, // 'filename1.jpg'
  };
  try {
    let object = await s3.getObject(params).promise();
    // // console.log(object);
    return { data: object, error: null };
  } catch (err) {
    console.log(err);
    return { data: null, error: err.message };
  }
};

// delete object
const deleteObjectFromBucket = async (bucketName, key) => {
  const params = {
    Bucket: bucketName, // 'my-unique-bucket-name',
    Key: key, // 'filename1.jpg'
  };
  try {
    let responseData = await s3.deleteObject(params).promise();
    // // console.log(responseData); // prints metadata
    return { data: responseData, error: null };
  } catch (err) {
    console.log(err);
    return { data: null, error: err.message };
  }
};

// delete objects
// delete up to 1000 objects.
// 'VersionId' can be specified to delete specific versions of a file
const deleteObjectsFromBucket = async (bucketName, keys) => {
  // convert keys array to array of objects [{ Key: 'filename.jpg' }]
  keys = keys.map((key) => ({ Key: key }));
  const params = {
    Bucket: bucketName, // 'my-unique-bucket-name',
    Delete: {
      Objects: keys, // [{ Key: "filename1.jpg" }, { Key: "filename2.jpg" }, { Key: "filename3.jpg" }]
    },
  };
  try {
    let responseData = await s3.deleteObjects(params).promise();
    console.log(responseData); // responseData = { Deleted: [ { DeleteMarker, DeleteMrkerVersionId, Key } ] }
    return { data: responseData, error: null };
  } catch (err) {
    console.log(err);
    return { data: null, error: err.message };
  }
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
