@import 'common.js'

var onRun = function(context) {
	//reference the sketch document
	var doc = context.document;
	//reference the pages array in the document
	var pages = [doc pages];
  //name of the Symbols page
  var symbolsPageName = "Symbols";

  //if the doc has a symbol page store it in here
  var hasSymbolsPage = false;
  hasSymbolsPage = checkIfHasSymbolsPage(pages, symbolsPageName);

  //reference a selected layer
  var selection = context.selection;

  //first check if something is selected
  if(selection.count() == 0){

    //if nothing is selected, then check if the document has a Symbols page
    if(hasSymbolsPage == true){

      //select the folder to save the pngs to
      var file_path = selectFolder();

      //export all the pngs to the folder
      exportAllSymbols(doc, pages, symbolsPageName, file_path);

      //if user doesn't press cancel, alert that the export is done
      if(file_path != undefined){
        alert("Symbols Exported!", "Symbols exported to : "+file_path);
      }

    }else{
      //alert user if no symbols page found
      alert("No Symbols Page Found!", "There is no page in this document named: "+symbolsPageName);
    }
  }else{
    //checks to see if selected layers are a MSSymbolMaster
    var isSymbolMaster = checkSelected(selection);

    //if they are, then loop through selection and export
    if(isSymbolMaster == true){

      //select the folder to save the pngs to
      var file_path = selectFolder();

      //export all MSSymbolMaster layers selected to folder
      for(var i = 0; i < selection.count(); i++){
        if(selection[i].class() == "MSSymbolMaster"){
          var artboard = selection[i];
          var artboardName = [artboard name];
          doc.saveArtboardOrSlice_toFile(artboard,file_path+"/"+artboardName+".png");

					if(file_path != undefined){
		        alert("Symbol Exported!", artboardName+".png exported to : "+file_path);
		      }
        }
      }
    }else{
      //tell user they can only select MSSymbolMaster layers
      doc.showMessage("Please only select Symbol Masters.");
    }
  }
}

function checkSelected(selection){
  for(var i = 0; i < selection.count(); i++){
    if(selection[i].class() == "MSSymbolMaster"){
      return true;
    }else{
      return false;
    }
  }
}

function selectFolder(){
  //open a window to select a folder to save to
  var panel = [NSOpenPanel openPanel];
  [panel setCanChooseDirectories:true];
  [panel setCanCreateDirectories:true];

  //checks if user clicks open in window
  var clicked = [panel runModal];
  if (clicked == NSFileHandlingPanelOKButton) {

    var isDirectory = true;
    var firstURL = [[panel URLs] objectAtIndex:0];
    var unformattedURL = [NSString stringWithFormat:@"%@", firstURL];

    //makes sure spaces aren't formatted to %20
    var file_path = [unformattedURL stringByRemovingPercentEncoding];

    //removes file:// from path
    if (0 === file_path.indexOf("file://")) {
       file_path = file_path.substring(7);
       return file_path;
    }
  }
}

function checkIfHasSymbolsPage(pages, symbolsPageName){

  var symbolPageCount = 0;

  for (var i = 0; i < pages.count(); i++){

    //reference each page
    var page = pages[i];

    //get the page name
    var pageName = [page name];

    //checks if the doc has a page with the name symbolsPageName
    if (pageName == symbolsPageName){
      symbolPageCount = symbolPageCount + 1;
    }
  }
  if(symbolPageCount > 0){
    return true;
  }else{
    return false;
  }
}

function exportAllSymbols(doc, pages, symbolsPageName, file_path){
  //loop through the pages array
	for (var i = 0; i < pages.count(); i++){

		//reference each page
		var page = pages[i];

    //get the page name
    var pageName = [page name];

    //checks if the page name is Symbols
    if (pageName == symbolsPageName){

      //reference the artboards of each symbol
      var artboards = [page artboards];
      for (var z = 0; z < artboards.count(); z++){

        //reference each artboard of each page
        var artboard = artboards[z];

        //get the name of the artboard and uses it as the file name
        var artboardName = [artboard name];

        //export the artboard
        doc.saveArtboardOrSlice_toFile(artboard,file_path+"/"+artboardName+".png");

      }
    }
	}
}
