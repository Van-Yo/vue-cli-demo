/**
 * @param {Blob} file - File or Blob object.
 * @param {function} callback - Callback function.
 * @example
 * getSeekableBlob(blob or file, callback);
 * @see {@link https://github.com/muaz-khan/RecordRTC|RecordRTC Source Code}
 */
export function getSeekableBlob(inputBlob, mediaType, callback) {
  const reader = new EBML.Reader()
  const decoder = new EBML.Decoder()
  const tools = EBML.tools

  const fileReader = new FileReader()
  fileReader.onload = function() {
    const ebmlElms = decoder.decode(this.result)
    ebmlElms.forEach(function(element) {
      reader.read(element)
    })
    reader.stop()
    const refinedMetadataBuf = tools.makeMetadataSeekable(
      reader.metadatas,
      reader.duration,
      reader.cues
    )
    const body = this.result.slice(reader.metadataSize)
    const newBlob = new Blob([refinedMetadataBuf, body], {
      type: mediaType
    })

    callback(newBlob)
  }
  fileReader.readAsArrayBuffer(inputBlob)
}
