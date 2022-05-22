import AWS from "aws-sdk";

// AWS.config.update({
//   credentials: {
//     accessKeyId: process.env.AWS_KEY,
//     secretAccessKey: process.env.AWS_SECRET,
//   },
// });

const s3 = new AWS.S3({
  credentials: {
    accessKeyId: process.env.AWS_KEY,
    secretAccessKey: process.env.AWS_SECRET,
  },
});

export const uploadToS3 = async (file, userId, dirName) => {
  const { filename, createReadStream } = await file;
  const readStream = createReadStream(); // Apollo server Upload를 통해 들어온 file로부터 createStream() 실행하여 스트림 가져오기
  const objectName = `${dirName}/${userId}-${Date.now()}-${filename}`;
  const { Location } = await s3
    .upload({
      Bucket: `insta-camelcrush`,
      Key: objectName,
      ACL: "public-read",
      Body: readStream,
    })
    .promise();
  return Location;
};

export const deleteFromS3 = async (fileUrl, dirName) => {
  const decodeUrl = decodeURI(fileUrl);
  const filePath = decodeUrl.split(`/${dirName}/`)[1];
  console.log(filePath);
  await s3
    .deleteObject({
      Bucket: "insta-camelcrush",
      Key: `${dirName}/${filePath}`,
    })
    .promise();
};
