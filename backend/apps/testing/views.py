from django.utils.timezone import now
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from .models import Question, TestSession
from .serializers import (
    LocalizedQuestionSerializer,
    SubmitTestSerializer,
    SessionResultSerializer,
)
from .scoring import compute_result


@api_view(["POST"])
@permission_classes([AllowAny])
def start_test(request):
    questions = Question.objects.filter(is_active=True).order_by("order")[:40]

    session = TestSession.objects.create(language="uz")
    serializer = LocalizedQuestionSerializer(questions, many=True)

    return Response(
        {
            "session_uuid": str(session.uuid),
            "language": "uz",
            "duration_seconds": 40 * 60,
            "total_questions": len(serializer.data),
            "questions": serializer.data,
            "message": "Test session created. Good luck!",
        },
        status=status.HTTP_201_CREATED,
    )


@api_view(["POST"])
@permission_classes([AllowAny])
def submit_test(request):
    serializer = SubmitTestSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    data = serializer.validated_data

    try:
        session = TestSession.objects.get(uuid=data["session_uuid"])
    except TestSession.DoesNotExist:
        return Response({"detail": "Session not found."}, status=404)

    if session.status == "completed":
        return Response(SessionResultSerializer(session).data)

    result = compute_result(session, data["answers"])

    session.raw_score = result["raw_score"]
    session.accuracy = result["accuracy"]
    session.iq_score = result["iq_score"]
    session.percentile = result["percentile"]
    session.category_breakdown = result["category_breakdown"]
    session.duration_seconds = result["duration_seconds"]
    session.status = "completed"
    session.finished_at = now()
    session.save()

    return Response({
        "message": "Test completed successfully.",
        "result": SessionResultSerializer(session).data,
    })


@api_view(["GET"])
@permission_classes([AllowAny])
def get_results(request, uuid):
    try:
        session = TestSession.objects.get(uuid=uuid)
    except TestSession.DoesNotExist:
        return Response({"detail": "Session not found."}, status=404)
    return Response(SessionResultSerializer(session).data)