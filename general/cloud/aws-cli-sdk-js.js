// -----------------
// aws sdk node.js
// -----------------

// docs
// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html

// file upload example
// https://medium.com/quant-five/node-js-with-amazon-sdk-for-s3-uploads-d20dd5c9ca4b

// file upload (multer)(express)
// https://grokonez.com/aws/node-js-restapis-upload-file-to-amazon-s3-using-express-multer-aws-sdk
// https://stackoverflow.com/questions/40494050/uploading-image-to-amazon-s3-using-multer-s3-nodejs
// https://scotch.io/@cizu/building-a-amazon-s3-api-with-express-and-multer-s3

// -----------------
// aws sdk node.js
// -----------------

// install node.js sdk
// npm install --save aws-sdk

// -----------------
// s3
// -----------------

// imports
const fs = require("fs");
const AWS = require("aws-sdk");
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

// create bucket
// make sure your ec2 instance has appropriate roles to access buckets under your account
// more parameters can be specified: ACL, GrantFullControl, GrantRead, GrandReadACP, GrantWrite, GrantWriteACP
const createS3Bucket = async () => {
  const params = {
    Bucket: "my-unique-bucket-name",
    CreateBucketConfiguration: {
      LocationConstraint: "us-east-1", // region
    },
  };
  try {
    let bucket = await s3.createBucket(params).promise();
    console.log(bucket); // bucket = { Location: "http://my-unique-bucket-name.s3.amazonaws.com" }
  } catch (err) {
    console.log(err);
  }
};

// check bucket exists
const checkBucketExists = async () => {
  const params = {
    Bucket: "my-unique-bucket-name",
  };
  try {
    let bucketData = await s3.headBucket(params).promise();
    console.log(bucketData);
  } catch (err) {
    console.log(err);
  }
};

// delete bucket
const deleteS3Bucket = async () => {
  const params = {
    Bucket: "my-unique-bucket-name",
  };
  try {
    let response = await s3.deleteBucket(params).promise();
    console.log(response); // successful response
  } catch (err) {
    console.log(err); // error response
  }
};

// list buckets
const listBuckets = async () => {
  const params = {};
  try {
    let buckets = await s3.listBuckets(params).promise();
    console.log(buckets);
  } catch (err) {
    console.log(err);
  }
};

// put object
// ACL options -- private, public-read, public-read-write, authenticated-read, aws-exec-read, bucket-owner-read, bucket-owner-full-control,
// Body -- buffer or stream (convert file to binary)
// possibilities: use data from fs.createReadStream(), use data from fs.readFile(), convert to buffer.
// https://stackoverflow.com/questions/13807339/upload-a-binary-file-to-s3-using-aws-sdk-for-node-js
// Buffer
// const base64Data = new Buffer(data, 'binary')
// Body: base64Data

// put object (use 'upload')
const putObject = async () => {
  try {
    var data = await fs.readFile("filename.jpg");
  } catch (err) {
    console.log(err);
    return; // exit function
  }
  const params = {
    // ACL: "authenticated-read",
    Body: data,
    Bucket: "my-unique-bucket-name",
    Key: "filename1.jpg",
    // ServerSideEncryption: "AES256",
    // StorageClass: "STANDARD_IA"
  };
  try {
    let objectData = await s3.putObject(params).promise();
    console.log(objectData);
  } catch (err) {
    console.log(err);
  }
};

// upload
const upload = async () => {
  try {
    var data = await fs.readFile("filename.jpg");
  } catch (err) {
    console.log(err);
    return; // exit function
  }
  const params = {
    Body: data,
    Bucket: "my-unique-bucket-name",
    Key: "filename.jpg",
    // ServerSideEncryption: "AES256",
    // StorageClass: "STANDARD_IA"
  };
  try {
    let objectData = await s3.upload(params).promise();
    console.log(objectData);
  } catch (err) {
    console.log(err);
  }
};

// get object
const getObject = async () => {
  const params = {
    Bucket: "my-unique-bucket-name",
    Key: "filename1.jpg",
  };
  try {
    let object = await s3.getObject(params).promise();
    console.log(object);
  } catch (err) {
    console.log(err);
  }
};

// check object exists
const checkObjectExists = async () => {
  const params = {
    Bucket: "my-unique-bucket-name",
    Key: "filename1.jpg",
  };
  try {
    let objectData = await s3.headObject(params).promise();
    console.log(objectData); // prints metadata
  } catch (err) {
    console.log(err);
  }
};

// delete object
const deleteObject = async () => {
  const params = {
    Bucket: "my-unique-bucket-name",
    Key: "filename.jpg",
  };
  try {
    let response = await s3.deleteObject(params).promise();
    console.log(response); // prints metadata
  } catch (err) {
    console.log(err);
  }
};

// delete objects
// delete up to 1000 objects.
// 'VersionId' can be specified to delete specific versions of a file
const deleteObjects = async () => {
  const params = {
    Bucket: "my-unique-bucket-name",
    Delete: {
      Objects: [
        { Key: "filename1.jpg" },
        { Key: "filename2.jpg" },
        { Key: "filename3.jpg" },
      ],
    },
  };
  try {
    let data = await s3.deleteObjects(params).promise();
    console.log(data); // data = { Deleted: [ { DeleteMarker, DeleteMrkerVersionId, Key } ] }
  } catch (err) {
    console.log(err);
  }
};

// list objects
// lists up to 1000 objects. 'MaxKeys' can be used to limit response
const listObjects = async () => {
  const params = {
    Bucket: "my-unique-bucket-name",
    // MaxKeys: 10
  };
  try {
    let objectsData = await s3.listObjects(params).promise();
    console.log(objectsData); // prints metadata for all objects
  } catch (err) {
    console.log(err);
  }
};

// -----------------
//
// -----------------
