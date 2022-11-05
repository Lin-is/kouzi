<?php
  use PHPMailer\PHPMailer\PHPMailer;
  use PHPMailer\PHPMailer\Exception;

  require 'phpmailer/src/Exception.php';
  require 'phpmailer/src/PHPMailer.php';

  $mail = new PHPMailer(true);
  $mail->CharSet = 'UTF-8';
  $mail->setLanguage('ru', 'phpmailer/language/');
  $mail->isHTML(true);

  $mail->setFrom('', 'Обгреватели КОУЗИ');
  $mail->addAddress('pi662607015@gmail.com');
  $mail->Subject = 'Новое сообщение с сайта КОУЗИ';

  $body = '<h1>Новая заявка</h1>';

  if (trim(!empty($_POST['name']))) {
    $body.='<p>Имя: </p>'.$_POST['name'].'</p>';
  }

  if (trim(!empty($_POST['phone']))) {
    $body.='<p>Телефон: </p>'.$_POST['phone'].'</p>';
  }

  if (trim(!empty($_POST['email']))) {
    $body.='<p>Электронная почта: </p>'.$_POST['email'].'</p>';
  }

  if (trim(!empty($_POST['roomArea']))) {
    $body.='<p>Площадь помещения: </p>'.$_POST['roomArea'].' м2</p>';
  }

  if (trim(!empty($_POST['roomHeight']))) {
    $body.='<p>Высота помещения: </p>'.$_POST['roomHeight'].' м</p>';
  }

  if (trim(!empty($_POST['phone']))) {
    $body.='<p>Телефон: </p>'.$_POST['phone'].'</p>';
  }

  $premiseType = "";
  if ($_POST['callback_premise-type'] == 'living') {
    $premiseType = "жилое";
  } else if ($_POST['callback_premise-type'] == 'notLiving') {
    $premiseType = "нежилое";
  }

  if ($premiseType) {
    $body.='<p>Тип помещения: </p>'.$premiseType.'</p>';
  }

  if (trim(!empty($_POST['contactus_form-message']))) {
    $body.='<p>Вопрос клиента: </p>'.$_POST['contactus_form-message'].'</p>';
  }

  if (trim(!empty($_POST['modal_callback-aboutItem']))) {
    $body.='<p>Хотят узнать про товар: </p>'.$_POST['modal_callback-aboutItem'].'</p>';
  }


  $mail->Body = $body;

  if (!$mail->send()) {
    $message = 'Ошибка';
  } else {
    $message = 'Данные отправлены';
  }

  $response = ['message' => $message];

  header('Content-type: application/json');
  echo json_encode($response);
?>