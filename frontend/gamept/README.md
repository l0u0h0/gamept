# GamePT_Front

## React + TypeScript + Vite

## 개발 서버 구동 방법

- `pnpm i`로 node_modules 생성
- 개발 서버 구동은 `pnpm dev` or `pnpm vite`

### pnpm 사용 시 에러 발생한다면

<img src="https://file.notion.so/f/f/98aeb514-972c-431a-84c8-25d82e157219/1bc1bd7e-4ef3-4743-ae54-ef50af8c0467/Untitled.jpeg?id=788b4c39-46f9-4dfb-8417-73645704e7d5&table=block&spaceId=98aeb514-972c-431a-84c8-25d82e157219&expirationTimestamp=1698717600000&signature=bDZtuPPojlU_Bi5I6lWGHH-iHexaYON4eZ2DSfQEYRM&downloadName=Untitled.jpeg" width="30%" /> 
<img src="https://file.notion.so/f/f/98aeb514-972c-431a-84c8-25d82e157219/eebc6d0d-0de9-4cdd-a516-864e285b5568/KakaoTalk_20231004_010021416.jpg?id=52364d91-587b-480b-b0b4-0021b47a7bf3&table=block&spaceId=98aeb514-972c-431a-84c8-25d82e157219&expirationTimestamp=1698717600000&signature=sA8ZD6IbXXpSeyA2DgToXVXKt-aXAn5elPmcfgBLfx4&downloadName=KakaoTalk_20231004_010021416.jpg" width="30%" />

## 빌드 진행 시

### pnpm

- `pnpm build`를 통해 빌드 진행
- 빌드된 파일은 `dist` 디렉토리에

### npm

- `npm build`를 통해 빌드 진행
- 빌드된 파일은 `build` 디렉토리에

## 프로젝트 구조

> 아토믹 디자인 패턴 사용

```
📦gamept
 ┣ 📂public
 ┃ ┗ 📜vite.svg
 ┣ 📂src
 ┃ ┣ 📂assets
 ┃ ┃ ┣ 📂font
 ┃ ┃ ┗ 📜react.svg
 ┃ ┣ 📂atoms
 ┃ ┣ 📂oragnisms
 ┃ ┣ 📂pages
 ┃ ┣ 📂services -> Jotai나 Axios 등 서비스 로직
 ┃ ┣ 📂types -> TS 사용 시 생기는 인터페이스나 타입 등의 코드
 ┃ ┣ 📜App.css
 ┃ ┣ 📜App.tsx
 ┃ ┣ 📜index.css
 ┃ ┣ 📜main.tsx
 ┃ ┗ 📜vite-env.d.ts
 ┣ 📜.eslintrc.cjs
 ┣ 📜.gitignore
 ┣ 📜.prettierrc.json
 ┣ 📜Dockerfile
 ┣ 📜front.conf
 ┣ 📜index.html
 ┣ 📜package.json
 ┣ 📜pnpm-lock.yaml
 ┣ 📜postcss.config.js
 ┣ 📜README.md
 ┣ 📜tailwind.config.js
 ┣ 📜tsconfig.json
 ┣ 📜tsconfig.node.json
 ┗ 📜vite.config.ts
```
