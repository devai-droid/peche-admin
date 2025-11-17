# peche-admin

## Tools and Prerequisites
- node version >= 18
- yarn
- prettier
- aws cli
- [CSS Modules](https://marketplace.visualstudio.com/items?itemName=clinyong.vscode-css-modules)
- [react-query v5](https://tanstack.com/query/v5/docs/react/overview)
- [orval](https://orval.dev/guides/react-query)
- [tailwind css](https://tailwindcss.com/)
- [twin macro](https://github.com/ben-rogerson/twin.macro)

## Installation
- `aws configure --profile peche`
- `make init STAGE=dev`

## Running the app
`make run STAGE=dev`

stage 없으면 local 로 실행됩니다. 로컬 빌드 전에 백앤드 실행 필수.
