import { HttpClient } from '@angular/common/http';

export class UploadAdapter {
  constructor(
    private loader: any,
    private http: HttpClient,
    private uploadUrl: string,
  ) {}

  upload(): Promise<any> {
    return this.loader.file.then((file: File) => {
      const formData = new FormData();
      formData.append('file', file);

      return new Promise((resolve, reject) => {
        this.http.post<any>(this.uploadUrl, formData).subscribe({
          next: (res) => {
            resolve({
              default: res.imageUrl,
            });
          },
          error: (err) => reject(err),
        });
      });
    });
  }

  abort() {}
}
