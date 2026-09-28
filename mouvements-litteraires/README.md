# Mouvements Littéraires

12 Fransız edebi akımını (Humanisme'den Nouveau Roman'a) ezberlemek için bir tarayıcı oyunu. Dönemler, özellikler, eserler, yazarlar, yıllar ve alıntılar dahil.

## Özellikler

- **Oyun**: 278 soru, çoğu yazmalı. Her bilgi 2 kez doğru bilinince "ezberlendi" sayılır; yanlış bilinenler hemen tekrar gelir.
- Yazılı cevaplarda aksan, büyük/küçük harf, noktalama ve baştaki *le / la / les* önemsenmez; küçük yazım hataları kabul edilir.
- **Kronoloji**: 12 akımı eskiden yeniye sıralama oyunu.
- **Fiches**: tüm içeriğin özet kartları.
- İlerleme tarayıcıda (`localStorage`) saklanır.

## Çalıştırma

Kurulum gerekmez. `index.html` dosyasını tarayıcıda açman yeterli.

### GitHub Pages ile yayınlama

1. Bu klasörün içeriğini bir GitHub deposuna yükle.
2. **Settings → Pages** bölümünde *Source* olarak `main` dalını ve `/ (root)` klasörünü seç.
3. Birkaç dakika sonra oyun `https://<kullanıcı-adı>.github.io/<depo-adı>/` adresinde açılır.

## Dosya yapısı

```
index.html      sayfa iskeleti
css/style.css   tasarım (açık / koyu tema)
js/data.js      ders içeriği: 12 akım, özellikler, eserler, alıntılar
js/app.js       soru üretimi, cevap kontrolü, oyun motoru
```

İçeriği değiştirmek veya yeni bilgi eklemek için yalnızca `js/data.js` dosyasını düzenle; sorular otomatik üretilir.
