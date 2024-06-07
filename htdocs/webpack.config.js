const path = require('path'); // 경로 관련 모듈: 파일 및 디렉터리 경로를 다루기 위한 도구입니다.
const glob = require('glob'); // 파일 패턴 매칭 모듈: 특정 패턴과 일치하는 파일들을 찾기 위한 도구입니다.
const webpack = require('webpack'); // Webpack 모듈 번들러: 자바스크립트 파일을 번들링하고 최적화하기 위한 도구입니다.
const webpackDevMiddleware = require('webpack-dev-middleware'); // Webpack 개발 미들웨어: Webpack 빌드 파일을 메모리에 저장하고 제공하는 미들웨어입니다.
const webpackHotMiddleware = require('webpack-hot-middleware'); // Webpack 핫 미들웨어: 핫 모듈 교체(HMR)를 지원하는 미들웨어입니다.

// 엔트리 포인트를 동적으로 생성하는 함수
function getEntries() {
  // 특정 디렉터리의 모든 JS 파일을 찾습니다.
  const entries = glob.sync('./a_sys_mng/JS/*.js').reduce((acc, file) => {
    const name = path.basename(file, path.extname(file)); // 파일 이름 추출
    acc[name] = [path.resolve(__dirname, file), 'webpack-hot-middleware/client']; // 엔트리 포인트 설정
    return acc;
  }, {});
  return entries;
}

// Webpack 설정을 내보내는 함수
module.exports = (env, argv) => {
  return {
    mode: 'development', // 개발 모드 설정
    entry: getEntries(), // 동적으로 생성된 엔트리 포인트 사용
    output: {
      path: path.resolve(__dirname, 'a_sys_mng/JS'), // 번들된 파일이 저장될 경로
      filename: '[name].bundle.js', // 번들된 파일 이름 형식
      publicPath: '/a_sys_mng/JS/', // 정적 파일이 제공될 경로
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/, // JS 및 JSX 파일에 대한 규칙
          exclude: /node_modules/, // node_modules 디렉터리는 제외
          use: {
            loader: 'babel-loader', // Babel 로더 사용: 최신 자바스크립트 문법을 구 버전 브라우저에서도 동작하도록 변환합니다.
          },
        },
      ],
    },
    resolve: {
      extensions: ['.js', '.jsx'], // 해석할 파일 확장자
    },
    plugins: [
      new webpack.ProgressPlugin(), // 빌드 진행 표시 플러그인: 빌드 진행 상황을 표시합니다.
      new webpack.HotModuleReplacementPlugin(), // HMR 플러그인 추가: 핫 모듈 교체를 지원합니다.
      function () {
        // 빌드 완료 후 실행되는 플러그인
        this.hooks.done.tap('DonePlugin', (stats) => {
          console.log('Webpack build finished.'); // 빌드 완료 메시지를 출력합니다.
          if (stats.hasErrors()) {
            console.error('Build errors:', stats.compilation.errors); // 빌드 오류 발생 시 오류 메시지를 출력합니다.
          }
        });
      },
    ],
    devServer: {
      static: {
        directory: path.join(__dirname, 'a_sys_mng'), // 정적 파일 제공 경로
        publicPath: '/a_sys_mng', // 정적 파일 제공 URL 경로
      },
      compress: true, // 콘텐츠 압축 활성화: 응답을 압축하여 전송합니다.
      port: 9000, // 개발 서버 포트 번호
      devMiddleware: {
        publicPath: '/a_sys_mng/JS/', // 개발 미들웨어의 공개 경로
      },
      hot: true, // HMR 활성화: 핫 모듈 교체를 활성화합니다.
      proxy: [
        {
          context: ['/api'], // API 요청 프록시 설정
          target: 'http://localhost:3000', // 프록시 대상
          secure: false, // SSL 인증서 검증 비활성화
        },
      ],
    },
    watchOptions: {
      ignored: /node_modules/, // node_modules 디렉터리는 감시하지 않음
      aggregateTimeout: 300, // 변경 후 딜레이: 파일 변경 후 재빌드까지의 대기 시간
      poll: 1000, // 폴링 간격: 파일 변경을 감지할 폴링 주기
    },
    performance: {
      hints: false, // 성능 힌트 비활성화: 성능 관련 경고를 표시하지 않음
    },
  };
};

// 1. 모듈 가져오기:
// 필요한 모듈들을 가져옵니다. 각 모듈은 특정 기능을 담당합니다.

// 2. 엔트리 포인트 동적 생성:
// getEntries 함수는 특정 디렉터리의 모든 JS 파일을 찾아 엔트리 포인트로 설정합니다. 이를 통해 각 JS 파일에 대해 별도의 번들을 생성할 수 있습니다.

// 3. Webpack 설정 내보내기:
// module.exports를 통해 Webpack 설정을 내보냅니다. 이는 Webpack이 빌드 시 사용할 설정을 정의합니다.
// mode는 개발 모드를 설정합니다.
// entry는 동적으로 생성된 엔트리 포인트를 사용합니다.
// output은 번들된 파일이 저장될 경로와 파일 이름 형식을 지정합니다.
// module은 JS 및 JSX 파일을 처리하기 위한 로더 규칙을 정의합니다.
// resolve는 해석할 파일 확장자를 지정합니다.
// plugins는 빌드 진행 표시와 HMR 플러그인을 포함합니다.
// devServer는 개발 서버 설정을 정의합니다. 정적 파일 경로, 포트 번호, HMR 활성화 및 API 요청 프록시 설정을 포함합니다.
// watchOptions는 파일 감시 옵션을 설정합니다.
// performance는 성능 힌트를 비활성화합니다.