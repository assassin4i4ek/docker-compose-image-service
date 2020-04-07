from flask import Flask, request, send_file
from flask_cors import CORS
from io import BytesIO
import os
import base64
import numpy as np
import matplotlib.pyplot as plt
from matplotlib.backends.backend_agg import FigureCanvasAgg as FigureCanvas
from matplotlib.figure import Figure
import cv2
import py_eureka_client.eureka_client as eureka_client

app = Flask(__name__)
cors = CORS(app)

@app.route('/api/process/histo', methods=['POST'])
def get_histo():
    # read src file
    src_file = request.files['src']
    src = src_file.read()
    src_file.close()
    # convert src to ndarray
    src_nparr = np.frombuffer(src, np.uint8)
    src_np = cv2.imdecode(src_nparr, cv2.IMREAD_COLOR)
    # build histogram
    histo_np = build_histo(src_np)
    _, res = cv2.imencode('.png', histo_np)
    cv2.imwrite('tmp.png', histo_np)
    return send_file(BytesIO(res), mimetype='image/png')


def build_histo(im_array):
    # plot histo
    fig = plt.figure()
    ax = fig.add_subplot(111)
    colors = ('b', 'g', 'r')
    for i, col in enumerate(colors):
        i_histogram = cv2.calcHist([im_array], [i], None, [256], [0, 256])
        ax.plot(i_histogram, color=col)
    ax.set_xlim([0, 256])
    # convert plot to image
    fig.canvas.draw()
    w, h = fig.canvas.get_width_height()
    histo_np = np.frombuffer(fig.canvas.tostring_rgb(), dtype='uint8')
    histo_np.shape = (h, w, 3)
    histo_np = histo_np[..., ::-1]
    return histo_np

def app_init():
    port = int(os.environ.get('PORT', 5000))
    service_name = os.environ.get('SERVICE_ALIAS', 'image-processor')
    eureka_server = os.environ.get('EUREKA_SERVER', 'http://localhost:8761/eureka')        
    eureka_client.init_registry_client(eureka_server=eureka_server, app_name=service_name, instance_port=port)

app_init()

if __name__ == "__main__":
    app.run()
