use base64;
use flate2::read::{GzDecoder, ZlibDecoder};
use flate2::write::{GzEncoder, ZlibEncoder};
use flate2::Compression;
use std::io::{Read, Write};

fn main() {
    print_section_header(String::from("basic zlib"));
    basic_zlib();

    print_section_header(String::from("basic gzip"));
    basic_gzip();
}

fn basic_zlib() {
    // Zlib compress
    let contents: String = "'Never go back on your word, and never give up.' ".to_string()
        + "That's your ninja way -- and as your mentor, I have no business whining!";
    let contents_bytes = contents.as_bytes();
    let mut encoder = ZlibEncoder::new(Vec::new(), Compression::default());
    encoder.write_all(contents_bytes).unwrap();
    let contents_compressed_bytes = encoder.finish().unwrap();
    // Base64 encode
    let contents_base64_encoded = base64::encode(&contents_compressed_bytes);
    // Base64 decode
    let contents_base64_decoded = base64::decode(&contents_base64_encoded).unwrap();
    // Zlib decompress
    let mut decoder = ZlibDecoder::new(&*contents_base64_decoded);
    let mut contents_uncompressed = String::new();
    let bytes_read = decoder
        .read_to_string(&mut contents_uncompressed)
        .unwrap_or(0);

    println!("contents: {}", contents);
    println!("contents_bytes: {:?}", contents_bytes);
    println!("contents_compressed_bytes: {:?}", contents_compressed_bytes);
    println!("contents_base64_encoded: {:?}", contents_base64_encoded);
    println!("contents_base64_decoded: {:?}", contents_base64_decoded);
    println!("contents_uncompressed: {}", contents_uncompressed);
    println!("bytes_read: {}", bytes_read);
}

fn basic_gzip() {
    // Gzip compress
    let contents: String = "I have faith that there will come a time ".to_string()
        + "when people can truly understand one another.";
    let contents_bytes = contents.as_bytes();
    let mut encoder = GzEncoder::new(Vec::new(), Compression::default());
    encoder.write_all(contents_bytes).unwrap();
    let contents_compressed_bytes = encoder.finish().unwrap();
    // Base64 encode
    let contents_base64_encoded = base64::encode(&contents_compressed_bytes);
    // Base64 decode
    let contents_base64_decoded = base64::decode(&contents_base64_encoded).unwrap();
    // Gzip decompress
    let mut decoder = GzDecoder::new(&*contents_base64_decoded);
    let mut contents_uncompressed = String::new();
    let bytes_read = decoder
        .read_to_string(&mut contents_uncompressed)
        .unwrap_or(0);

    println!("contents: {}", contents);
    println!("contents_bytes: {:?}", contents_bytes);
    println!("contents_compressed_bytes: {:?}", contents_compressed_bytes);
    println!("contents_base64_encoded: {:?}", contents_base64_encoded);
    println!("contents_base64_decoded: {:?}", contents_base64_decoded);
    println!("contents_uncompressed: {}", contents_uncompressed);
    println!("bytes_read: {}", bytes_read);
}

pub fn print_section_header(header: String) {
    println!("");
    println!("{}", header.to_ascii_uppercase());
    println!("");
}

// Vec does not implement Read
// https://stackoverflow.com/a/42241174
