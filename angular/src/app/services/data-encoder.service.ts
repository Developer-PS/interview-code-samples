import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataEncoderService {

  constructor() { }

  async gzip_decompress(s: Uint8Array): Promise<ArrayBuffer> {
    try {
      const ds = new DecompressionStream('gzip');
      const decompressedStream = new Blob([s]).stream().pipeThrough(ds);
      return await new Response(decompressedStream).arrayBuffer();
    } catch (error) {
      console.error('Decompression failed:', error);
      throw error;
    }
  }
  
  async gzip_compress(s: Uint8Array): Promise<ArrayBuffer> {
    try {
      const cs = new CompressionStream('gzip');
      const compressedStream = new Blob([s]).stream().pipeThrough(cs);
      return await new Response(compressedStream).arrayBuffer();
    } catch (error) {
      console.error('Compression failed:', error);
      throw error;
    }
  }
  
  async encode_promise(s: string): Promise<string> {
    try {
      const te = new TextEncoder();
      const byte_str = te.encode(s);
      const compressed_blob = await this.gzip_compress(byte_str);
  
      return btoa(String.fromCharCode(...new Uint8Array(compressed_blob))).replaceAll("/", "_");
    } catch (error) {
      console.error('Encoding failed:', error);
      throw error;
    }
  }
  
  async decode_promise(s: string): Promise<string> {
    try {
      const compressed_bytes = Uint8Array.from(atob(s.replaceAll("_", "/")), (c) => c.charCodeAt(0));
      const decompressed_blob = await this.gzip_decompress(compressed_bytes);
  
      const td = new TextDecoder('utf-8');
      return td.decode(decompressed_blob);
    } catch (error) {
      console.error('Decoding failed:', error);
      throw error;
    }
  }

  encode(s: string): Observable<string> {
    return from(this.encode_promise(s))
  }

  decode(s: string): Observable<string> {
    return from(this.decode_promise(s))
  }
}
