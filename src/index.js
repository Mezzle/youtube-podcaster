const fs = require('fs');
const youtubedl = require('youtube-dl');
let requested_format = '251';
const progress = require('progress-stream');
const ProgressBar = require('progress');

const video = youtubedl('https://www.youtube.com/watch?v=dGv-_8tk8g4', [
  `--format=${requested_format}`
]);

video.on('info', info => {
  let filesize = 0;
  let ext = '';

  for (let format of info.formats) {
    if (format.format_id == requested_format) {
      filesize = format.filesize;
      ext = format.ext;
    }
  }

  const str = progress({ length: filesize, time: 100 });

  const bar = new ProgressBar('  downloading [:bar] :rate/bps :percent :etas', {
    complete: '=',
    head: '>',
    incomplete: ' ',
    width: 100,
    clear: true,
    total: filesize
  });

  let lastTransferred = 0;
  str.on('progress', progress => {
    bar.tick(progress.transferred - lastTransferred);

    lastTransferred = progress.transferred;
  });

  video.pipe(str).pipe(fs.createWriteStream(`test.${ext}`));
});
