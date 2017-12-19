zip.workerScriptsPath = './zip/';

function fetchZip(url, callback, xhr_progress, zip_progress, error){
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.responseType = 'blob';
  xhr.onload = function(e) {
    if (this.status == 200) {
      // get binary data as a response
      unzipBlob(this.response, function(unzippedBlob) {
        // logs the uncompressed Blob
        const reader = new FileReader();

        // This fires after the blob has been read/loaded.
        reader.addEventListener('loadend', (e) => {
          const text = e.srcElement.result;
          callback(JSON.parse(text));
        });

        // Start reading the blob as text.
        reader.readAsText(unzippedBlob);
      }, zip_progress);
    }
  };
  xhr.onprogress = xhr_progress;
  xhr.onerror = function(){
    error(ErrorType.UNKNOWN, xhr, arguments);
  }
  xhr.onabort = function(){
    error(ErrorType.ABORT, xhr);
  };
  xhr.ontimeout = function(){
    error(ErrorType.TIMEOUT, xhr);
  };
  xhr.onloadend = function() {
    if(xhr.status == 404)
        error(ErrorType.FILENOTFOUND, xhr);
  }
  xhr.send();
}

function unzipBlob(blob, callback, zip_progress, error) {
  // use a zip.BlobReader object to read zipped data stored into blob variable
  zip.createReader(new zip.BlobReader(blob), function(zipReader) {
  //zip.createReader(zip.HttpRangeReader(blob), function(zipReader) {
    // get entries from the zip file
    var name;
    zipReader.getEntries(function(entries) {
      // get data from the first file
      name = entries[0].filename;
      entries[0].getData(new zip.BlobWriter("text/plain"), function(data) {
        // close the reader and calls callback function with uncompressed data as parameter
        zipReader.close();
        callback(data);
      }, function(current, total) {
        // Progress callback
        var event = {};
        event.loaded = current;
        event.total = total;
        zip_progress(event, entries[0].filename);
      });
    });
  }, function(event){
    error(ErrorType.ZIP, event);
  });
}
