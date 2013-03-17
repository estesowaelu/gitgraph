<?php
/* gets url */
function get_content_from_github($url) {
	
  $ch = curl_init();
  curl_setopt($ch,CURLOPT_URL,$url);
  curl_setopt($ch,CURLOPT_RETURNTRANSFER,1);
  curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE); 
  curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, FALSE); 

  $content = curl_exec($ch);
 
   if ($error = curl_error($ch))
   {
	   $content = $error;
   }
	curl_close($ch);
	return $content;
}

?>
