# 個人研究室

静かな青緑の実験室を、自分の自己紹介とリンクの入口にする個人サイトです。

- 公開サイト: https://morusu16.github.io/
- 編集用の手帳: https://morusu16.github.io/owner.html

編集用の手帳は、この端末の下書きと公開内容を分けています。「公開に反映する」からGitHubの確認画面を開き、所有者のアカウントで承認すると更新します。訪問者の編集操作では公開内容を変更できません。

公開更新は所有者本人からの申請だけを処理します。GitHubの認証情報はサイトに保存しません。入力データは決められたプロフィール項目だけを受け付け、URL・配置・文字数・重複IDを検証します。公開済みデータが別の操作で更新されていた場合、古い下書きで上書きせずに停止します。

元のローカル版で作った下書きは、手帳の「書き出す」で保存してから、公開版の手帳の「読み込む」で引き継げます。

## 開発と確認

Node.js 22以上で、追加パッケージなしで実行できます。

```text
node verify-public.cjs
node verify-drawers.cjs
node verify-inventory.cjs
node verify-labels.cjs
node verify-lighting.cjs
node verify-publishing.mjs
node scripts/build-site.mjs
```

公開ファイルは `dist/` に生成します。GitHub Pages は `.github/workflows/pages.yml` で配信します。`profile.json` が公開プロフィールの保存元です。`observatory/DESIGN.md` に制作上の決定事項があります。
