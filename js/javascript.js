// =============================================================================
//                               各定数
// =============================================================================
const XML_FILENAME = "data.xml";  // XMLデータファイル
const IMG_TAG ="img_file";        // 画像のXMLタグ
const BGM_TAG = "bgm_file";       // BGMのXMLタグ

// スライドショーにて画像が切り替わる間隔（単位：ms）
const SLIDE_SHOW_INTERVAL_MS = 5000;
// 各ボタンをクリックした時にアイコンを変更している時間(単位：ms)
const BTN_PUSH_EFFECT_INTERVAL_MS = 300;
// =============================================================================

var imgList; // 画像ファイルリスト
var soundPath; // BGMファイル

// XMLデータの読み込み
var xmlhttp = new XMLHttpRequest();
xmlhttp.open("GET", XML_FILENAME);
xmlhttp.send();
xmlhttp.onreadystatechange = function(){
  if (xmlhttp.readyState == 4){
    if (xmlhttp.status == 200){
      
      // XMLデータの読み込み
      var doc = xmlhttp.responseXML.documentElement;
      imgList = doc.getElementsByTagName(IMG_TAG);
      soundPath = doc.getElementsByTagName(BGM_TAG);
    }
  }
};

// 引数1(id_name)で指定されたidタグの画像を、引数2(change_img_file_path)
// の画像に一定時間変更
// (ユーザが各ボタンがクリックしたことを示すために、アイコンを一定時間変更）
function tmp_change_disp_img(id_name, change_img_file_path){
  // 元の画像を保持
  var org_img_path = document.getElementById(id_name).src;
  
  // 画像を変更
  document.getElementById(id_name).src = change_img_file_path;
  
  // 一定時間経過後に元の画像へ戻す
  setTimeout(
      function() {
        document.getElementById(id_name).src = org_img_path;
      },
      BTN_PUSH_EFFECT_INTERVAL_MS);
}

window.onload = function() {
  // ===========================================================================
  //                           画像に関する処理
  // ============================= start =======================================
  var $imgDoc = document.getElementById("slide_image");
  var currentImgNo = 0; // 何番目の画像を表示しているか
  var interval_id; // slideshow関数の繰り返し処理を止める時に使用
  
  // 何番目の画像を表示しているか、ページ中で示す
  function dispImgPosition(){
    var dispString = (currentImgNo + 1) + " / " + imgList.length;
    document.getElementById("panel_area_slide_info").innerHTML = dispString;
  }
  
  // スライドショーを実行
  function slideshow(){
   // 表示する画像を決定
   if (currentImgNo == (imgList.length - 1)){
     currentImgNo = 0;
    }else {
     currentImgNo++;
    }
    
    // 次の画像を表示
    $imgDoc.src = imgList[currentImgNo].innerHTML;
    dispImgPosition();
  }
  
  // 「次へ」ボタンのクリック処理（画像の切り替え）
  document.getElementById('next_btn').onclick = function() {
    // スライドショーを一旦中止
    clearInterval(interval_id);
    
    // 最後の画像が表示されている場合、「次へ」ボタン
    // で表示できる画像がないため処理を行わない
    if (currentImgNo != (imgList.length - 1)){
      //次の画像を表示
      currentImgNo++;
      $imgDoc.src = imgList[currentImgNo].innerHTML;
      dispImgPosition();
      
      // ボタンがクリックされたため、アイコンを一定時間変更
      tmp_change_disp_img("next_btn", "./data/btn/next_click_btn.png");
    }
    
    // スライドショーを再開
    interval_id = setInterval(slideshow, SLIDE_SHOW_INTERVAL_MS);
  };
  
  // 「戻る」ボタンのクリック処理（画像の切り替え）
  document.getElementById('prev_btn').onclick = function() {
    // スライドショーを一旦中止
    clearInterval(interval_id);
    
    // 最初の画像が表示されている場合、「戻る」ボタンで表示できる
    // 画像がないため処理を行わない
    if (currentImgNo != 0){
      // 1つ前の画像を表示
      currentImgNo--;
      $imgDoc.src = imgList[currentImgNo].innerHTML;
      dispImgPosition();
      
      // ボタンがクリックされたため、アイコンを一定時間変更
      tmp_change_disp_img("prev_btn", "./data/btn/prev_click_btn.png");
    }
    
    // スライドショーを再開
    interval_id = setInterval(slideshow, SLIDE_SHOW_INTERVAL_MS);
  };
  // ============================== end ========================================
  
  
  // ===========================================================================
  //                            BGMに関する操作
  // ============================== start ======================================
  var bgm;
  
  // BGM情報の初期化
  function initBgm(){
    bgm = new Audio();
    bgm.src = soundPath[0].innerHTML;
    bgm.loop = true;
  }
  
  // BGMの自動再生（ページ読み込み後に実行）
  function autoPlayBgm(){
    bgm.play();
  }
  
  // ページへ現在の音量を表示(パーセントで表示)
  function dispBgmVolumeInfo(){
    
    // 音量を「0.0~1.0」の値から「0%～100%」の値に変換
    var dispVolume = Math.floor(bgm.volume * 10);
    dispVolume *= 10;
    
    // 音量をページに表示
    document.getElementById("panel_area_bgm_info").innerHTML = dispVolume + " %";
  }
  
  // 「再生」ボタンのクリック処理（BGMの再生）
  document.getElementById('bgm_play').onclick = function() {
    bgm.play();
    
    // ボタンがクリックされたため、アイコンを一定時間変更
    tmp_change_disp_img("bgm_play", "./data/btn/play_click_btn.png");
  };
  
  // 「一時停止」ボタンのクリック処理（BGMの一時停止）
  document.getElementById('bgm_pause').onclick = function() {
    bgm.pause();
    
    // ボタンがクリックされたため、アイコンを一定時間変更
    tmp_change_disp_img("bgm_pause", "./data/btn/pause_click_btn.png");
  };
  
  // 「停止」ボタンのクリック処理（BGMの停止）
  document.getElementById('bgm_stop').onclick = function() {
    bgm.pause();
    bgm.currentTime = 0;
    
    // ボタンがクリックされたため、アイコンを一定時間変更
    tmp_change_disp_img("bgm_stop", "./data/btn/stop_click_btn.png");
  };
  
  // 「音量UP」ボタンのクリック処理（BGM音量のUP）
  document.getElementById('bgm_up').onclick = function() {
    // 既に音量が100%の場合、何も処理しない
    if (bgm.volume == 1){
      return;
    }
    
    if (bgm.volume > 0.9){
      bgm.volume = 1;
    }else{
     bgm.volume += 0.1;
    }
    
    // 現在の音量を表示
    dispBgmVolumeInfo();
    
    // ボタンがクリックされたため、アイコンを一定時間変更
    tmp_change_disp_img("bgm_up", "./data/btn/sound_up_click_btn.png");
  };

  // 「音量DOWN」ボタンのクリック処理（BGM音量のDOWN）
  document.getElementById('bgm_down').onclick = function() {
    // 既に音量が0%の場合、何も処理しない
    if (bgm.volume == 0){
      return;
    }
    
    if (bgm.volume < 0.1){
      bgm.volume = 0;
    }else{
      bgm.volume -= 0.1;
    }
    
    // 現在の音量を表示
    dispBgmVolumeInfo();
    
    // ボタンがクリックされたため、アイコンを一定時間変更
    tmp_change_disp_img("bgm_down", "./data/btn/sound_down_click_btn.png");
  };
  // ============================== end ========================================
  
  // BGM情報の初期化
  initBgm();
  
  // BGMの自動再生
  autoPlayBgm();
  
  // 最初に1枚目の画像を表示
  $imgDoc.src = imgList[currentImgNo].innerHTML;
  dispImgPosition();
  
  // スライドショーの開始
  interval_id = setInterval(slideshow, SLIDE_SHOW_INTERVAL_MS);
};
